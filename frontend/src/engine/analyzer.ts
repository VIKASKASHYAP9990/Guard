// ============================================================
// InvestGuard — Pure Deterministic Behavioral Engine
// Analyzes portfolio, transactions, and price history
// to detect 6 behavioral patterns without external APIs.
// Hard constraints: Transparent, reproducible, no predictive logic.
// ============================================================

import {
  Transaction,
  Holding,
  BehavioralAlert,
  BehaviorReport,
  BehavioralIndicator,
  DetectionConfig,
  PatternType,
  AlertSeverity,
  IndicatorLevel,
} from '../types';
import {
  PATTERN_DISPLAY_NAMES,
  PATTERN_SHORT_NAMES,
  PATTERN_EXPLANATIONS,
  REFLECTION_QUESTIONS,
} from '../content/copy';
import { generateId } from '../lib/formatters';
import { getPriceHistory, getLatestPrice } from '../lib/mockData';

// Default configuration
export const DEFAULT_DETECTION_CONFIG: DetectionConfig = {
  fomoPriceSurgeThreshold: 8,      // 8% surge
  fomoLookbackDays: 5,             // in 5 days
  overtradingTradeCountThreshold: 5,// 5 trades
  overtradingWindowDays: 3,        // in 3 days
  concentrationThreshold: 25,      // 25% single holding
  panicDropThreshold: 7,           // 7% drop
  panicLookbackDays: 3,            // in 3 days
  lossAversionDrawdownThreshold: 15,// 15% drawdown
  lossAversionDaysHeldThreshold: 45,// held > 45 days
  marketTimingWindowDays: 7,       // 7-day roundtrip
  riskTolerance: 'MODERATE',
};

/**
 * Calculate price change % for a ticker over lookbackDays ending at asOfDate
 */
function getPriceChangePct(ticker: string, asOfDate: string, lookbackDays: number): { changePct: number; startPrice: number; endPrice: number } | null {
  const history = getPriceHistory(ticker);
  if (!history || history.length === 0) return null;

  // Find index of asOfDate or closest prior date
  let targetIdx = history.findIndex(p => p.date === asOfDate);
  if (targetIdx === -1) {
    targetIdx = history.length - 1;
  }

  const startIdx = Math.max(0, targetIdx - lookbackDays);
  const startPrice = history[startIdx].close;
  const endPrice = history[targetIdx].close;

  if (startPrice === 0) return null;
  const changePct = ((endPrice - startPrice) / startPrice) * 100;
  return { changePct, startPrice, endPrice };
}

/**
 * 1. FOMO Buying Detector
 * Flag BUY trades occurring after asset gained >= threshold% over lookback window
 */
export function detectFOMOBuying(
  transactions: Transaction[],
  config: DetectionConfig
): BehavioralAlert[] {
  const alerts: BehavioralAlert[] = [];
  const buyTrades = transactions.filter(t => t.type === 'BUY');

  for (const trade of buyTrades) {
    const priceData = getPriceChangePct(trade.ticker, trade.date, config.fomoLookbackDays);
    if (!priceData) continue;

    if (priceData.changePct >= config.fomoPriceSurgeThreshold) {
      const severity: AlertSeverity = priceData.changePct >= config.fomoPriceSurgeThreshold * 1.8 ? 'HIGH' : 'MODERATE';
      const evidence = `${trade.ticker} gained +${priceData.changePct.toFixed(1)}% over ${config.fomoLookbackDays} days (₹${priceData.startPrice.toFixed(2)} → ₹${priceData.endPrice.toFixed(2)}) prior to BUY of ${trade.quantity} units at ₹${trade.price.toFixed(2)} on ${trade.date}.`;

      alerts.push({
        id: generateId('alert_fomo'),
        patternType: 'FOMO_BUYING',
        title: PATTERN_DISPLAY_NAMES.FOMO_BUYING,
        severity,
        detectedAt: trade.date,
        ticker: trade.ticker,
        description: `Buy trade followed a sharp price rise of +${priceData.changePct.toFixed(1)}%.`,
        evidence,
        explanation: PATTERN_EXPLANATIONS.FOMO_BUYING,
        reflectionQuestion: REFLECTION_QUESTIONS.FOMO_BUYING,
        status: 'NEW',
        metrics: {
          surgePct: priceData.changePct,
          lookbackDays: config.fomoLookbackDays,
          tradePrice: trade.price,
          priorPrice: priceData.startPrice,
        },
      });
    }
  }

  return alerts;
}

/**
 * 2. Overtrading Detector
 * Flag clusters of trades >= count threshold within windowDays
 */
export function detectOvertrading(
  transactions: Transaction[],
  config: DetectionConfig
): BehavioralAlert[] {
  const alerts: BehavioralAlert[] = [];
  if (transactions.length < config.overtradingTradeCountThreshold) return alerts;

  // Sort chronologically
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Sliding window check
  const windowMs = config.overtradingWindowDays * 24 * 60 * 60 * 1000;
  const processedRanges = new Set<string>();

  for (let i = 0; i < sorted.length; i++) {
    const windowStart = new Date(sorted[i].date).getTime();
    const cluster = sorted.filter(t => {
      const tTime = new Date(t.date).getTime();
      return tTime >= windowStart && tTime <= windowStart + windowMs;
    });

    if (cluster.length >= config.overtradingTradeCountThreshold) {
      const startDate = sorted[i].date;
      const endDate = cluster[cluster.length - 1].date;
      const rangeKey = `${startDate}_${endDate}`;

      if (!processedRanges.has(rangeKey)) {
        processedRanges.add(rangeKey);
        const severity: AlertSeverity = cluster.length >= config.overtradingTradeCountThreshold * 1.6 ? 'HIGH' : 'MODERATE';
        const totalTurnover = cluster.reduce((sum, t) => sum + t.amount, 0);
        const uniqueTickers = Array.from(new Set(cluster.map(t => t.ticker)));

        alerts.push({
          id: generateId('alert_overtrade'),
          patternType: 'OVERTRADING',
          title: PATTERN_DISPLAY_NAMES.OVERTRADING,
          severity,
          detectedAt: endDate,
          description: `${cluster.length} trades executed within a ${config.overtradingWindowDays}-day period across ${uniqueTickers.length} assets.`,
          evidence: `${cluster.length} trades executed between ${startDate} and ${endDate} with total turnover of ₹${totalTurnover.toLocaleString('en-IN')}. Involved tickers: ${uniqueTickers.join(', ')}.`,
          explanation: PATTERN_EXPLANATIONS.OVERTRADING,
          reflectionQuestion: REFLECTION_QUESTIONS.OVERTRADING,
          status: 'NEW',
          metrics: {
            tradeCount: cluster.length,
            windowDays: config.overtradingWindowDays,
            totalTurnover,
            uniqueTickersCount: uniqueTickers.length,
          },
        });
      }
    }
  }

  return alerts;
}

/**
 * 3. Concentration Alert
 * Flag any single holding exceeding threshold % of total portfolio value
 */
export function detectConcentration(
  holdings: Holding[],
  config: DetectionConfig
): BehavioralAlert[] {
  const alerts: BehavioralAlert[] = [];
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  if (totalValue <= 0) return alerts;

  for (const holding of holdings) {
    const allocationPct = (holding.currentValue / totalValue) * 100;

    if (allocationPct >= config.concentrationThreshold) {
      const severity: AlertSeverity = allocationPct >= 40 ? 'HIGH' : 'MODERATE';
      const evidence = `${holding.ticker} represents ${allocationPct.toFixed(1)}% of total portfolio value (₹${holding.currentValue.toLocaleString('en-IN')} of ₹${totalValue.toLocaleString('en-IN')}), exceeding the ${config.concentrationThreshold}% benchmark.`;

      alerts.push({
        id: generateId('alert_conc'),
        patternType: 'CONCENTRATION',
        title: PATTERN_DISPLAY_NAMES.CONCENTRATION,
        severity,
        detectedAt: new Date().toISOString().split('T')[0],
        ticker: holding.ticker,
        description: `Single position represents ${allocationPct.toFixed(1)}% of your total portfolio.`,
        evidence,
        explanation: PATTERN_EXPLANATIONS.CONCENTRATION,
        reflectionQuestion: REFLECTION_QUESTIONS.CONCENTRATION,
        status: 'NEW',
        metrics: {
          allocationPct,
          thresholdPct: config.concentrationThreshold,
          holdingValue: holding.currentValue,
          totalPortfolioValue: totalValue,
        },
      });
    }
  }

  return alerts;
}

/**
 * 4. Panic Selling Detector
 * Flag SELL trades occurring after asset dropped >= threshold% over lookback window
 */
export function detectPanicSelling(
  transactions: Transaction[],
  config: DetectionConfig
): BehavioralAlert[] {
  const alerts: BehavioralAlert[] = [];
  const sellTrades = transactions.filter(t => t.type === 'SELL');

  for (const trade of sellTrades) {
    const priceData = getPriceChangePct(trade.ticker, trade.date, config.panicLookbackDays);
    if (!priceData) continue;

    if (priceData.changePct <= -config.panicDropThreshold) {
      const severity: AlertSeverity = priceData.changePct <= -config.panicDropThreshold * 1.8 ? 'HIGH' : 'MODERATE';
      const evidence = `${trade.ticker} declined ${priceData.changePct.toFixed(1)}% over ${config.panicLookbackDays} days (₹${priceData.startPrice.toFixed(2)} → ₹${priceData.endPrice.toFixed(2)}) prior to SELL of ${trade.quantity} units at ₹${trade.price.toFixed(2)} on ${trade.date}.`;

      alerts.push({
        id: generateId('alert_panic'),
        patternType: 'PANIC_SELLING',
        title: PATTERN_DISPLAY_NAMES.PANIC_SELLING,
        severity,
        detectedAt: trade.date,
        ticker: trade.ticker,
        description: `Sell trade followed a rapid drop of ${priceData.changePct.toFixed(1)}%.`,
        evidence,
        explanation: PATTERN_EXPLANATIONS.PANIC_SELLING,
        reflectionQuestion: REFLECTION_QUESTIONS.PANIC_SELLING,
        status: 'NEW',
        metrics: {
          dropPct: priceData.changePct,
          lookbackDays: config.panicLookbackDays,
          tradePrice: trade.price,
          priorPrice: priceData.startPrice,
        },
      });
    }
  }

  return alerts;
}

/**
 * 5. Loss Aversion Detector
 * Flag holdings held at significant unrealized loss (> threshold%) for extended periods (> threshold days)
 */
export function detectLossAversion(
  holdings: Holding[],
  transactions: Transaction[],
  config: DetectionConfig
): BehavioralAlert[] {
  const alerts: BehavioralAlert[] = [];
  const today = new Date();

  for (const holding of holdings) {
    const pnlPct = holding.unrealizedPnlPercent;

    if (pnlPct <= -config.lossAversionDrawdownThreshold) {
      // Find oldest active buy for this ticker
      const buys = transactions
        .filter(t => t.ticker === holding.ticker && t.type === 'BUY')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (buys.length > 0) {
        const firstBuyDate = new Date(buys[0].date);
        const daysHeld = Math.floor((today.getTime() - firstBuyDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysHeld >= config.lossAversionDaysHeldThreshold) {
          const severity: AlertSeverity = pnlPct <= -25 ? 'HIGH' : 'MODERATE';
          const evidence = `${holding.ticker} is currently down ${pnlPct.toFixed(1)}% (avg buy ₹${holding.avgBuyPrice.toFixed(2)} vs current ₹${holding.currentPrice.toFixed(2)}) and has been held through drawdown for ${daysHeld} days.`;

          alerts.push({
            id: generateId('alert_loss_av'),
            patternType: 'LOSS_AVERSION',
            title: PATTERN_DISPLAY_NAMES.LOSS_AVERSION,
            severity,
            detectedAt: today.toISOString().split('T')[0],
            ticker: holding.ticker,
            description: `Position held through ${Math.abs(pnlPct).toFixed(1)}% unrealized loss for ${daysHeld} days.`,
            evidence,
            explanation: PATTERN_EXPLANATIONS.LOSS_AVERSION,
            reflectionQuestion: REFLECTION_QUESTIONS.LOSS_AVERSION,
            status: 'NEW',
            metrics: {
              drawdownPct: pnlPct,
              daysHeld,
              avgBuyPrice: holding.avgBuyPrice,
              currentPrice: holding.currentPrice,
            },
          });
        }
      }
    }
  }

  return alerts;
}

/**
 * 6. Market Timing Detector
 * Flag rapid buy-sell or sell-buy roundtrips in same ticker within windowDays
 */
export function detectMarketTiming(
  transactions: Transaction[],
  config: DetectionConfig
): BehavioralAlert[] {
  const alerts: BehavioralAlert[] = [];
  const windowMs = config.marketTimingWindowDays * 24 * 60 * 60 * 1000;

  // Group by ticker
  const byTicker: Record<string, Transaction[]> = {};
  for (const t of transactions) {
    if (!byTicker[t.ticker]) byTicker[t.ticker] = [];
    byTicker[t.ticker].push(t);
  }

  for (const [ticker, trades] of Object.entries(byTicker)) {
    const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      // Opposing trade types within window
      if (current.type !== next.type) {
        const timeDiff = new Date(next.date).getTime() - new Date(current.date).getTime();
        if (timeDiff <= windowMs && timeDiff >= 0) {
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          const evidence = `Reversal in ${ticker}: ${current.type} on ${current.date} followed by ${next.type} on ${next.date} (${daysDiff} day gap).`;

          alerts.push({
            id: generateId('alert_mkt_timing'),
            patternType: 'MARKET_TIMING',
            title: PATTERN_DISPLAY_NAMES.MARKET_TIMING,
            severity: daysDiff <= 2 ? 'HIGH' : 'MODERATE',
            detectedAt: next.date,
            ticker,
            description: `Quick ${current.type} → ${next.type} turnaround within ${daysDiff} day(s).`,
            evidence,
            explanation: PATTERN_EXPLANATIONS.MARKET_TIMING,
            reflectionQuestion: REFLECTION_QUESTIONS.MARKET_TIMING,
            status: 'NEW',
            metrics: {
              firstTradeType: current.type,
              secondTradeType: next.type,
              daysApart: daysDiff,
            },
          });
        }
      }
    }
  }

  return alerts;
}

/**
 * Calculate Diversification Score (0-100)
 * Uses Herfindahl-Hirschman Index (HHI) inverted
 */
export function calculateDiversificationScore(holdings: Holding[]): number {
  if (holdings.length === 0) return 0;
  if (holdings.length === 1) return 10;

  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  if (totalValue <= 0) return 0;

  // Calculate sum of squared market share percentages (HHI)
  // Perfect monopoly = 10,000. 10 equal stocks = 1,000.
  let hhi = 0;
  for (const h of holdings) {
    const share = (h.currentValue / totalValue) * 100;
    hhi += share * share;
  }

  // Map HHI (10000 = single stock -> 10 score; <= 1000 = diversified -> 95 score)
  const normalized = Math.max(0, Math.min(100, Math.round(100 - (hhi / 100))));
  return normalized;
}

/**
 * Calculate Behavioral Health Score (0-100)
 * Base 100 minus penalties for active alert patterns
 */
export function calculateBehavioralScore(alerts: BehavioralAlert[]): number {
  let score = 100;

  for (const alert of alerts) {
    if (alert.severity === 'HIGH') {
      score -= 14;
    } else if (alert.severity === 'MODERATE') {
      score -= 8;
    } else {
      score -= 4;
    }
  }

  return Math.max(10, Math.min(100, score));
}

/**
 * Determine indicator levels for each pattern
 */
function computeIndicators(alerts: BehavioralAlert[], totalTrades: number): BehavioralIndicator[] {
  const patternCounts: Record<PatternType, { high: number; mod: number; total: number }> = {
    FOMO_BUYING: { high: 0, mod: 0, total: 0 },
    OVERTRADING: { high: 0, mod: 0, total: 0 },
    CONCENTRATION: { high: 0, mod: 0, total: 0 },
    PANIC_SELLING: { high: 0, mod: 0, total: 0 },
    LOSS_AVERSION: { high: 0, mod: 0, total: 0 },
    MARKET_TIMING: { high: 0, mod: 0, total: 0 },
  };

  for (const a of alerts) {
    patternCounts[a.patternType].total++;
    if (a.severity === 'HIGH') patternCounts[a.patternType].high++;
    if (a.severity === 'MODERATE') patternCounts[a.patternType].mod++;
  }

  const allPatterns: PatternType[] = [
    'FOMO_BUYING',
    'OVERTRADING',
    'CONCENTRATION',
    'PANIC_SELLING',
    'LOSS_AVERSION',
    'MARKET_TIMING',
  ];

  return allPatterns.map(pattern => {
    const counts = patternCounts[pattern];
    let level: IndicatorLevel = 'LOW';

    if (totalTrades < 3 && pattern !== 'CONCENTRATION') {
      level = 'INSUFFICIENT_DATA';
    } else if (counts.high > 0 || counts.total >= 3) {
      level = 'HIGH';
    } else if (counts.mod > 0 || counts.total >= 1) {
      level = 'MODERATE';
    }

    return {
      pattern,
      name: PATTERN_SHORT_NAMES[pattern],
      level,
      score: level === 'HIGH' ? 80 : level === 'MODERATE' ? 45 : level === 'LOW' ? 15 : 0,
      description: PATTERN_EXPLANATIONS[pattern].definition,
      alertCount: counts.total,
    };
  });
}

/**
 * Full Behavioral Analysis Orchestrator
 * Runs all 6 pattern detectors and aggregates metrics
 */
export function runBehavioralAnalysis(
  holdings: Holding[],
  transactions: Transaction[],
  config: DetectionConfig = DEFAULT_DETECTION_CONFIG
): BehaviorReport {
  // Run all detectors
  const fomoAlerts = detectFOMOBuying(transactions, config);
  const overtradeAlerts = detectOvertrading(transactions, config);
  const concentrationAlerts = detectConcentration(holdings, config);
  const panicAlerts = detectPanicSelling(transactions, config);
  const lossAversionAlerts = detectLossAversion(holdings, transactions, config);
  const marketTimingAlerts = detectMarketTiming(transactions, config);

  // Combine and sort alerts by severity (HIGH first) then date descending
  const severityRank: Record<AlertSeverity, number> = { HIGH: 3, MODERATE: 2, LOW: 1 };
  const allAlerts = [
    ...fomoAlerts,
    ...overtradeAlerts,
    ...concentrationAlerts,
    ...panicAlerts,
    ...lossAversionAlerts,
    ...marketTimingAlerts,
  ].sort((a, b) => {
    const sevDiff = severityRank[b.severity] - severityRank[a.severity];
    if (sevDiff !== 0) return sevDiff;
    return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
  });

  const behavioralScore = calculateBehavioralScore(allAlerts);
  const diversificationScore = calculateDiversificationScore(holdings);

  // Risk score (0-100): Weighted combination of behavioral score (inverted) and concentration
  const riskScore = Math.min(100, Math.round((100 - behavioralScore) * 0.6 + (100 - diversificationScore) * 0.4));

  const indicators = computeIndicators(allAlerts, transactions.length);

  // Summary message
  let summary = 'Your investment behavior displays consistent discipline across measured dimensions.';
  if (allAlerts.length > 0) {
    const topPattern = allAlerts[0].title;
    summary = `Analysis identified ${allAlerts.length} behavioral observation(s). Primary pattern observed: ${topPattern}. Review detailed evidence cards below.`;
  }

  return {
    behavioralScore,
    riskScore,
    diversificationScore,
    alerts: allAlerts,
    indicators,
    summary,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Update holdings based on transactions and current prices
 */
export function recalculateHoldings(transactions: Transaction[]): Holding[] {
  const holdingMap: Record<string, { quantity: number; totalCost: number; ticker: string; name: string; sector: string }> = {};

  // Sort chronologically
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const t of sorted) {
    if (!holdingMap[t.ticker]) {
      holdingMap[t.ticker] = {
        quantity: 0,
        totalCost: 0,
        ticker: t.ticker,
        name: t.name || t.ticker,
        sector: t.sector || 'General',
      };
    }

    const h = holdingMap[t.ticker];
    if (t.type === 'BUY') {
      h.quantity += t.quantity;
      h.totalCost += t.amount;
    } else if (t.type === 'SELL') {
      if (h.quantity > 0) {
        const avgCost = h.totalCost / h.quantity;
        h.quantity = Math.max(0, h.quantity - t.quantity);
        h.totalCost = h.quantity * avgCost;
      }
    }
  }

  const holdings: Holding[] = [];
  const totalPortValue = Object.values(holdingMap).reduce((sum, h) => {
    if (h.quantity <= 0) return sum;
    const currentPrice = getLatestPrice(h.ticker);
    return sum + (h.quantity * currentPrice);
  }, 0);

  for (const h of Object.values(holdingMap)) {
    if (h.quantity <= 0) continue;

    const currentPrice = getLatestPrice(h.ticker);
    const avgBuyPrice = h.quantity > 0 ? h.totalCost / h.quantity : 0;
    const currentValue = h.quantity * currentPrice;
    const investedValue = h.totalCost;
    const unrealizedPnl = currentValue - investedValue;
    const unrealizedPnlPercent = investedValue > 0 ? (unrealizedPnl / investedValue) * 100 : 0;
    const allocationPercent = totalPortValue > 0 ? (currentValue / totalPortValue) * 100 : 0;

    // Price change 24h
    const history = getPriceHistory(h.ticker);
    let priceChange24h = 0;
    let priceChange24hPercent = 0;
    if (history && history.length >= 2) {
      const prevClose = history[history.length - 2].close;
      priceChange24h = currentPrice - prevClose;
      priceChange24hPercent = prevClose > 0 ? (priceChange24h / prevClose) * 100 : 0;
    }

    holdings.push({
      id: generateId(`holding_${h.ticker}`),
      ticker: h.ticker,
      name: h.name,
      quantity: h.quantity,
      avgBuyPrice,
      currentPrice,
      currentValue,
      investedValue,
      unrealizedPnl,
      unrealizedPnlPercent,
      allocationPercent,
      sector: h.sector,
      priceChange24h,
      priceChange24hPercent,
    });
  }

  return holdings;
}
