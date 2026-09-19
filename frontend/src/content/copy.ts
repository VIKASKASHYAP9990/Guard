// ============================================================
// InvestGuard — Compliance Copy Module
// ALL user-facing behavioral copy lives here.
// Strictly compliant with hedged phrasing and regulatory guardrails.
// ============================================================

import { PatternType, BehavioralExplanation } from '../types';

// ============================================================
// Pattern Display Names
// ============================================================

export const PATTERN_DISPLAY_NAMES: Record<PatternType, string> = {
  FOMO_BUYING: 'Possible FOMO-like Buying Pattern',
  OVERTRADING: 'Potential Overtrading Pattern',
  CONCENTRATION: 'Concentration Alert',
  PANIC_SELLING: 'Possible Short-Term Reaction Pattern',
  LOSS_AVERSION: 'Possible Loss-Aversion Pattern',
  MARKET_TIMING: 'Potential Market-Timing Pattern',
};

export const PATTERN_SHORT_NAMES: Record<PatternType, string> = {
  FOMO_BUYING: 'FOMO-like Buying',
  OVERTRADING: 'Overtrading',
  CONCENTRATION: 'Concentration',
  PANIC_SELLING: 'Short-Term Reaction',
  LOSS_AVERSION: 'Loss-Aversion',
  MARKET_TIMING: 'Market-Timing',
};

// ============================================================
// Reflection Prompts (Active Self-Assessment)
// ============================================================

export const REFLECTION_QUESTIONS: Record<PatternType, string> = {
  FOMO_BUYING:
    'Did you intend to purchase this position before the price increase, or did the recent momentum influence the timing of your entry?',
  OVERTRADING:
    'Are these recent transactions part of a planned rebalancing, or did they respond to short-term price movements and volatility?',
  CONCENTRATION:
    'Does this position size reflect an intentional high-conviction decision, or has it grown larger than your risk framework recommends?',
  PANIC_SELLING:
    'Did the underlying fundamental reason for owning this investment change before you sold, or was the decision prompted primarily by the sharp price decline?',
  LOSS_AVERSION:
    'Are you continuing to hold this position because its long-term investment case remains sound, or because you are waiting to recoup your purchase cost?',
  MARKET_TIMING:
    'Are these rapid transactions aligned with a systematic strategy, or are they attempts to anticipate short-term market tops and bottoms?',
};

// ============================================================
// Detailed Structured Explanations
// ============================================================

export const PATTERN_EXPLANATIONS: Record<PatternType, BehavioralExplanation> = {
  FOMO_BUYING: {
    definition:
      'A buy transaction executed immediately following a sharp, multi-day upward price acceleration in an asset.',
    whyItHappens:
      'Driven by availability cascades and social proof. Seeing rapid green candles creates anxiety over missed profits, leading investors to buy near momentum exhaustion.',
    whatEvidenceShows:
      'Buy order coincided with a multi-day price surge exceeding standard volatility thresholds.',
    whatThisMeans:
      'Entering positions at extended valuations increases the probability of suffering immediate pullbacks and volatility drawdowns.',
    whatToConsider: [
      'Establish a mandatory 24-hour cooling-off rule before buying trending assets.',
      'Check whether the company\'s valuation metrics (P/E, EV/EBITDA) still justify entry after the run-up.',
      'Utilize staggered limit orders or systematic SIP entries rather than single market buys on green days.',
    ],
    whatToAvoid: [
      'Avoid buying purely based on social media momentum or trending breakout alerts.',
      'Avoid market buy orders during peak intraday volume spikes.',
      'Avoid sizing up position sizes just because recent price action was positive.',
    ],
  },
  OVERTRADING: {
    definition:
      'An unusually high clustering of buy and sell executions within a short window, creating excessive turnover.',
    whyItHappens:
      'Stemming from Action Bias and the Illusion of Control. During choppy markets, investors feel compelled to "do something" rather than remain patient.',
    whatEvidenceShows:
      'Transaction count over a rolling multi-day window significantly exceeds normal baseline frequency.',
    whatThisMeans:
      'Frequent turnover generates substantial brokerage drag, STT taxes, and bid-ask slippage while interrupting long-term compounding.',
    whatToConsider: [
      'Limit portfolio rebalancing to predefined monthly or quarterly intervals.',
      'Document a written pre-trade thesis before executing any discretionary transaction.',
      'Track cumulative trading commissions and taxes to see true net performance.',
    ],
    whatToAvoid: [
      'Avoid checking price quotes multiple times every hour when holding long-term investments.',
      'Avoid executing "revenge trades" to recover a small loss immediately.',
      'Avoid day-trading core portfolio holdings.',
    ],
  },
  CONCENTRATION: {
    definition:
      'A single asset or sector accounting for a disproportionately high percentage of total portfolio equity.',
    whyItHappens:
      'Caused by Familiarity Bias and Overconfidence. Investors over-allocate to familiar companies assuming familiarity equates to low risk.',
    whatEvidenceShows:
      'Position market value exceeds the defined concentration benchmark percentage of total portfolio capital.',
    whatThisMeans:
      'The portfolio is exposed to severe idiosyncratic shock risk. A single negative company event can inflict outsized damage.',
    whatToConsider: [
      'Establish a strict maximum cap (e.g. 15–25%) for any single holding.',
      'Gradually trim oversized winning positions to reinvest in complementary, uncorrelated sectors.',
      'Maintain an index or diversified fund core as the foundation of your portfolio.',
    ],
    whatToAvoid: [
      'Avoid believing that high personal conviction eliminates business or governance risk.',
      'Avoid adding capital exclusively to an already overweight position during dips.',
      'Avoid ignoring sector correlation between multiple stock holdings.',
    ],
  },
  PANIC_SELLING: {
    definition:
      'A sell execution triggered immediately following a sharp, sudden downward price decline.',
    whyItHappens:
      'Caused by the Affect Heuristic and Recency Bias. Sudden paper drawdowns trigger neurological stress responses, prompting panic selling to stop the emotional discomfort.',
    whatEvidenceShows:
      'Sell order executed shortly after a rapid drawdown exceeding normal volatility bands.',
    whatThisMeans:
      'Selling at the bottom of temporary drawdowns converts temporary paper losses into permanent capital destruction and misses subsequent recoveries.',
    whatToConsider: [
      'Review your original pre-trade journal thesis: has the underlying business model broken, or is this broad market sentiment?',
      'Enforce a 48-hour pause before liquidating core holdings during severe market crashes.',
      'Ensure your emergency cash reserve is funded so you never face liquidity pressure during market dips.',
    ],
    whatToAvoid: [
      'Avoid selling strictly in response to frightening macroeconomic news headlines.',
      'Avoid setting tight stop-losses on long-term compounder investments.',
      'Avoid panic-liquidating entire holdings in single lump-sum market orders.',
    ],
  },
  LOSS_AVERSION: {
    definition:
      'Holding deeply underwater positions for prolonged periods hoping to return to break-even, while selling winning positions prematurely.',
    whyItHappens:
      'The Disposition Effect and Sunk Cost Fallacy. Nobel prize research shows investors feel the pain of a loss twice as acutely as the joy of equivalent gain, leading to refusal to realize losses.',
    whatEvidenceShows:
      'Position is held at significant unrealized drawdown for an extended duration despite thesis deterioration.',
    whatThisMeans:
      'Tying up capital in deteriorating "dead money" prevents capital allocation into high-conviction growth opportunities.',
    whatToConsider: [
      'Ask the Clean Slate Test: "If I held this value in cash today, would I buy this exact stock at its current price?"',
      'Set clear fundamental invalidation criteria at the time of initial investment.',
      'Harvest tax losses strategically to offset taxable capital gains.',
    ],
    whatToAvoid: [
      'Avoid averaging down blindly into fundamentally deteriorating businesses.',
      'Avoid anchoring on your original purchase price as a meaningful valuation anchor.',
      'Avoid holding a declining stock solely to avoid admitting a decision error.',
    ],
  },
  MARKET_TIMING: {
    definition:
      'Rapid alternating buy and sell cycles in the same security within short periods attempting to catch tops and bottoms.',
    whyItHappens:
      'Overconfidence Bias and Hindsight Fallacy. Investors believe they can reliably predict short-term oscillations.',
    whatEvidenceShows:
      'Rapid buy-then-sell or sell-then-buy reversal cycle executed in the same ticker within a tight timeframe.',
    whatThisMeans:
      'Missing just a handful of the best trading days in an equity cycle permanently depresses long-term compound wealth.',
    whatToConsider: [
      'Adopt Systematic Investment Plans (SIP) to mathematically average entry prices without emotion.',
      'Evaluate your performance against a simple buy-and-hold index benchmark over 3-year periods.',
      'Separate a small "exploration sandbox" from your core long-term compounding portfolio.',
    ],
    whatToAvoid: [
      'Avoid trying to trade around core long-term investment positions.',
      'Avoid basing major asset allocations on short-term market pundits or price target predictions.',
      'Avoid oscillating between all-cash and all-stock positions based on market mood.',
    ],
  },
};

// ============================================================
// Mandatory Regulatory Disclaimer
// ============================================================

export const REGULATORY_DISCLAIMER =
  'InvestGuard is a behavioral-analytics simulation tool for retail investors. It does NOT provide financial, investment, or trading advice, nor does it recommend buying, selling, or holding any security. All stock tickers, market data, and simulation scenarios represent fictional assets for educational and research purposes. Past performance is no guarantee of future results.';
