import React, { useState } from 'react';
import { GraduationCap, BookOpen, CheckCircle2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const LearnPage: React.FC = () => {
  const [openCard, setOpenCard] = useState<number | null>(0);

  const lessons = [
    {
      title: '1. FOMO (Fear Of Missing Out)',
      category: 'Psychological Trap',
      definition: 'The impulse to purchase an asset rapidly because its market price is surging, driven by fear of missing potential future gains.',
      example: 'Stock ABC jumps 15% in two days. An investor buys immediately at peak valuation without reviewing fundamentals.',
      whyItMatters: 'Buying at momentum peaks often exposes investors to sharp retracements and buying overvalued securities.',
      reflection: 'Was this purchase part of your original investment plan, or a reaction to recent price momentum?'
    },
    {
      title: '2. Panic Selling',
      category: 'Emotional Liquidation',
      definition: 'Liquidating investments prematurely during sudden market pullbacks out of short-term anxiety rather than changed fundamentals.',
      example: 'A stock drops 8% in the morning session. An investor sells the position immediately to stop short-term paper losses.',
      whyItMatters: 'Panic selling locks in temporary paper losses and prevents participation in eventual fundamental market recoveries.',
      reflection: 'Did the underlying fundamental reason for owning the business change before you decided to sell?'
    },
    {
      title: '3. Overtrading',
      category: 'Velocity Antipattern',
      definition: 'Executing excessive buy and sell transactions within short timeframes, driven by market noise or restlessness.',
      example: 'Making 12 trades in 4 days when your normal baseline is 1-2 transactions per week.',
      whyItMatters: 'Overtrading increases transaction fees, generates short-term tax liabilities, and degrades long-term compounding discipline.',
      reflection: 'Was each transaction part of a predefined strategy or an impulsive reaction?'
    },
    {
      title: '4. Concentration Risk',
      category: 'Portfolio Structure',
      definition: 'Allocating an excessively large portion of capital (>30-40%) to a single security or sector.',
      example: 'Investing 50% of your total portfolio in a single semiconductor stock.',
      whyItMatters: 'High concentration eliminates the safety buffer of diversification, making total net worth hyper-vulnerable to single-company events.',
      reflection: 'Does having a major portion of capital in one holding match your overall risk tolerance?'
    },
    {
      title: '5. Loss Aversion',
      category: 'Behavioral Bias',
      definition: 'The psychological tendency to hold onto deteriorating positions indefinitely to avoid realizing a loss, hoping price returns to breakeven.',
      example: 'Refusing to close a position that has fallen 40% and whose thesis is broken, simply to avoid admitting a loss.',
      whyItMatters: 'Ties up capital in underperforming assets and incurs opportunity cost against better long-term investments.',
      reflection: 'Are you holding because the business fits your criteria today, or because you want to reach your original purchase price?'
    },
    {
      title: '6. Market Timing',
      category: 'Tactical Risk',
      definition: 'Attempting to predict short-term market tops and bottoms by executing rapid entry and exit trades.',
      example: 'Buying on Monday morning expecting a 2-day pop, then selling Wednesday regardless of thesis.',
      whyItMatters: 'Consistently timing short-term market noise is statistically unreliable for retail investors and increases turnover.',
      reflection: 'Are these short-term trades part of a systematic strategy?'
    },
    {
      title: '7. Diversification',
      category: 'Core Risk Management',
      definition: 'Spreading portfolio capital across non-correlated asset classes, sectors, and business models.',
      example: 'Dividing capital across Technology, Consumer Staples, Energy, and Cash reserves.',
      whyItMatters: 'Reduces overall portfolio volatility without sacrificing long-term expected portfolio returns.',
      reflection: 'How resilient is your portfolio if one specific industry sector experiences a downturn?'
    },
    {
      title: '8. Investment Thesis',
      category: 'Investment Discipline',
      definition: 'A written, objective rationale documenting why an asset is purchased, target holding window, and explicit reconsider conditions.',
      example: 'Writing down: "Buying AAPL for 3-year holding based on Services margin expansion; reconsider if Services revenue declines 2 quarters."',
      whyItMatters: 'Provides an objective benchmark to evaluate whether trades are disciplined or emotionally driven.',
      reflection: 'Did you record your thesis before executing your recent trade?'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-300">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Behavioral Finance & Risk Education</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Master the core behavioral concepts behind investor psychology. InvestGuard provides these lessons to foster long-term self-awareness.
        </p>
      </div>

      {/* Accordion Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson, idx) => {
          const isOpen = openCard === idx;
          return (
            <div key={idx} className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition">
              <button
                onClick={() => setOpenCard(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {lesson.category}
                  </span>
                  <h3 className="text-sm font-bold text-white">{lesson.title}</h3>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="p-5 pt-0 border-t border-slate-800/60 text-xs space-y-4">
                  <div>
                    <strong className="text-slate-300 block mb-1">Definition:</strong>
                    <p className="text-slate-300 leading-relaxed">{lesson.definition}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <strong className="text-slate-300 block mb-1">Practical Example:</strong>
                    <p className="text-slate-400">{lesson.example}</p>
                  </div>

                  <div>
                    <strong className="text-purple-300 block mb-1">Why It Matters:</strong>
                    <p className="text-slate-300">{lesson.whyItMatters}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/40 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-purple-200 block font-semibold mb-0.5">Reflection Question:</strong>
                      <p className="text-purple-300">{lesson.reflection}</p>
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
