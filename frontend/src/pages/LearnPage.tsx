// ============================================================
// InvestGuard — Behavioral Finance Academy
// 8 structured educational modules grounded in Nobel-prize winning
// behavioral economics (Kahneman, Tversky, Thaler) adapted for retail investors.
// ============================================================

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Flame,
  ArrowDownRight,
  PieChart,
  Repeat,
  Hourglass,
  Activity,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  biasName: string;
  category: string;
  readingTime: string;
  summary: string;
  deepDive: string;
  keyTakeaway: string;
  selfCheckQuestion: string;
  icon: React.ElementType;
}

const LESSONS: Lesson[] = [
  {
    id: 'fomo',
    title: 'FOMO & Availability Cascades in Bull Markets',
    biasName: 'Availability Bias & Herd Mentality',
    category: 'Market Psychology',
    readingTime: '4 min',
    icon: Flame,
    summary: 'Why retail investors frequently buy assets after dramatic price run-ups and how social proof drives irrational entries.',
    deepDive: 'When a stock rallies 30% in a week, media coverage and social discourse surge. Kahneman and Tversky identified this as the "Availability Heuristic" — investors assess risk based on how easily recent positive examples come to mind rather than fundamental valuation. Buying at the peak of an availability cascade often results in immediate drawdowns when early momentum traders take profits.',
    keyTakeaway: 'Decouple excitement from investment merit. A stock that surged 40% is riskier, not safer, than it was before the run-up.',
    selfCheckQuestion: 'Did I research this stock independently before it started trending, or did social media momentum prompt my interest?',
  },
  {
    id: 'overtrading',
    title: 'The Hidden Friction of Hyperactive Trading',
    biasName: 'Action Bias & Illusion of Control',
    category: 'Execution Habits',
    readingTime: '3 min',
    icon: Repeat,
    summary: 'How excessive turnover generates transaction drag, tax inefficiency, and lower compound returns.',
    deepDive: 'Barber and Odean’s famous study "Trading Is Hazardous to Your Wealth" proved that the most active retail investors underperform market benchmarks by over 6.5% annually. Hyperactivity is driven by "Action Bias" — the emotional need to feel productive during volatility rather than allowing compounding time to work.',
    keyTakeaway: 'Portfolio performance is often an exercise in patience. Inactivity is an active, disciplined decision.',
    selfCheckQuestion: 'Is this trade driven by a fundamental shift in business value, or an urge to feel in control of short-term volatility?',
  },
  {
    id: 'concentration',
    title: 'Concentration Risk & Familiarity Bias',
    biasName: 'Familiarity & Overconfidence Bias',
    category: 'Portfolio Construction',
    readingTime: '4 min',
    icon: PieChart,
    summary: 'Why placing excessive capital in a single stock introduces uncompensated idiosyncratic risk.',
    deepDive: 'Investors naturally allocate heavily to brands they use or understand, assuming operational familiarity equals financial safety. However, single-stock risks (governance shocks, sector disruption, regulatory shifts) cannot be diversified away without maintaining strict maximum position limits (typically 15–25% max).',
    keyTakeaway: 'No matter how high your conviction, unforeseen systemic or idiosyncratic shocks can wipe out concentrated portfolios.',
    selfCheckQuestion: 'If this single position suffered an unexpected 40% overnight drop, would my financial plan remain intact?',
  },
  {
    id: 'panic-selling',
    title: 'Short-Term Panic Reactions & Loss Realization',
    biasName: 'Recency Bias & Affect Heuristic',
    category: 'Risk Management',
    readingTime: '4 min',
    icon: ArrowDownRight,
    summary: 'The neurological urge to stop emotional pain by selling at the bottom of broad market drawdowns.',
    deepDive: 'During sudden sharp sell-offs, the brain’s amygdala triggers a threat response. Retail investors panic-sell to end the psychological discomfort of declining paper value. Historical market data proves that the best market days closely follow the worst market days; selling during panic locks in temporary paper drawdowns into permanent capital loss.',
    keyTakeaway: 'Market drawdowns are the non-negotiable admission price for long-term equity compounding.',
    selfCheckQuestion: 'Am I selling because the business model is permanently broken, or because looking at red numbers feels stressful right now?',
  },
  {
    id: 'loss-aversion',
    title: 'The Disposition Effect & Loss Aversion',
    biasName: 'Loss Aversion (Prospect Theory)',
    category: 'Decision Psychology',
    readingTime: '5 min',
    icon: Hourglass,
    summary: 'Why investors rush to sell winners for tiny profits while holding losing stocks for years hoping to break even.',
    deepDive: 'Kahneman and Tversky’s Prospect Theory demonstrated that the psychological pain of losing ₹10,000 is twice as intense as the joy of gaining ₹10,000. This asymmetry causes the "Disposition Effect" — investors cut their highest-performing assets prematurely to lock in a psychological "win", while obstinately refusing to sell deteriorating businesses to avoid admitting a mistake.',
    keyTakeaway: 'The stock market does not know or care what price you bought a share for. Evaluate assets based on their future potential, not your purchase anchor.',
    selfCheckQuestion: 'If I held this position as cash today, would I choose to buy this exact company at its current price?',
  },
  {
    id: 'market-timing',
    title: 'The Mirage of Market Timing',
    biasName: 'Hindsight Bias & Overconfidence',
    category: 'Strategy & Frameworks',
    readingTime: '4 min',
    icon: Activity,
    summary: 'Why rapid buying and selling to avoid dips consistently destroys long-term compound wealth.',
    deepDive: 'Market timing requires two nearly impossible decisions: picking the exact top to sell and picking the exact bottom to repurchase. Missing just the 10 best trading days over a 20-year horizon cuts cumulative equity returns by more than half. Systematic Periodic Investing (SIP) mathematically outperforms emotional market-timing attempts for retail investors.',
    keyTakeaway: 'Time in the market consistently beats timing the market.',
    selfCheckQuestion: 'Am I trying to outsmart millions of participants based on short-term price fluctuations?',
  },
  {
    id: 'anchoring',
    title: 'Anchoring Bias to Past Peak Prices',
    biasName: 'Anchoring & Adjustment Heuristic',
    category: 'Valuation Psychology',
    readingTime: '3 min',
    icon: Brain,
    summary: 'Why a 50% discount from an all-time high does not automatically make a stock cheap.',
    deepDive: 'Investors routinely anchor on past peak prices (e.g. "It was ₹2,000 last year, so at ₹1,000 it is a bargain"). If earnings or fundamentals deteriorated, the previous peak was an anomaly. Anchoring on obsolete reference points leads to "value traps".',
    keyTakeaway: 'Price is what you pay; value is what you receive. Never base value solely on historic peak prices.',
    selfCheckQuestion: 'Am I anchoring on where this stock used to trade, rather than where its future earnings are headed?',
  },
  {
    id: 'thesis-tracking',
    title: 'Pre-Trade Journaling: The Antidote to Hindsight Bias',
    biasName: 'Hindsight Bias (I Knew It All Along)',
    category: 'Practical Tooling',
    readingTime: '3 min',
    icon: BookOpen,
    summary: 'How writing down your investment thesis before trading prevents rewriting history after the outcome.',
    deepDive: 'Once an outcome is known, our memory automatically rewrites our original expectations to make the result appear predictable ("Hindsight Bias"). Keeping a pre-trade decision journal with explicit target holding horizons and invalidation conditions is the single most effective tool for developing authentic trading discipline.',
    keyTakeaway: 'A good decision that results in a loss is still a disciplined decision. A bad decision that results in a win is dangerous luck.',
    selfCheckQuestion: 'Have I documented my thesis and exit conditions before committing real capital to this trade?',
  },
];

export const LearnPage: React.FC = () => {
  const [expandedLesson, setExpandedLesson] = useState<string | null>('fomo');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-card space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Behavioral Finance Academy
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                8 Core Modules
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Master the psychological biases that influence 90% of retail trading errors. Grounded in Nobel-prize winning behavioral economics research.
            </p>
          </div>
        </div>
      </div>

      {/* Lesson Modules Accordion / Cards */}
      <div className="space-y-4">
        {LESSONS.map((lesson) => {
          const Icon = lesson.icon;
          const isExpanded = expandedLesson === lesson.id;

          return (
            <div
              key={lesson.id}
              className={`p-6 rounded-2xl glass-card transition-all space-y-4 border ${
                isExpanded ? 'border-indigo-500/40 shadow-xl shadow-indigo-950/20' : 'border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                className="flex items-start justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                        {lesson.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {lesson.readingTime} read
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Bias: <strong className="text-slate-300">{lesson.biasName}</strong>
                    </p>
                  </div>
                </div>

                <button className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Summary snippet (always visible) */}
              {!isExpanded && (
                <p className="text-xs text-slate-300 pl-13 leading-relaxed">
                  {lesson.summary}
                </p>
              )}

              {/* Expanded Lesson Deep Dive */}
              {isExpanded && (
                <div className="pt-4 border-t border-slate-800/80 space-y-5 animate-in fade-in duration-200">
                  {/* Detailed Reading */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                      Behavioral Economics Analysis
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {lesson.deepDive}
                    </p>
                  </div>

                  {/* Key Takeaway */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-emerald-300 block mb-0.5">Golden Rule / Key Takeaway:</strong>
                      <span className="text-slate-300 leading-relaxed">{lesson.keyTakeaway}</span>
                    </div>
                  </div>

                  {/* Self-Check Question */}
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
                    <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="text-indigo-300 block mb-0.5">Pre-Trade Self-Check Question:</strong>
                      <span className="text-slate-200 italic leading-relaxed">"{lesson.selfCheckQuestion}"</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
