import os
import requests
from typing import Dict, Any, Optional

AI_API_KEY = os.getenv("AI_API_KEY", "")

# Standard non-advisory fallback explanations for all 6 patterns
EXPLANATION_TEMPLATES: Dict[str, Dict[str, str]] = {
    "FOMO-like Buying": {
        "explanation": "Your recent purchase occurred shortly after a significant short-term market price increase. The transaction data indicates buying activity following positive momentum. The system cannot establish why the trade was initiated.",
        "reflection_question": "Was this purchase part of your original investment strategy or a reaction to recent price momentum?"
    },
    "Panic Selling": {
        "explanation": "Your position was liquidated shortly after a price decline. The transaction log shows a sell order following negative price movement. Transaction data alone cannot determine the underlying rationale.",
        "reflection_question": "Did the underlying fundamental reason for owning this investment change prior to selling?"
    },
    "Overtrading": {
        "explanation": "Your recent activity contains an unusually high number of transactions within a short timeframe compared with your historical baseline average. The data highlights a spike in transaction velocity.",
        "reflection_question": "Was each of these transactions executed according to a predefined, structured investment plan?"
    },
    "Concentration": {
        "explanation": "A single asset currently represents over 30% of your total portfolio valuation. High concentration increases portfolio sensitivity to individual security price fluctuations.",
        "reflection_question": "Does having a large proportion of capital in a single holding align with your risk tolerance and diversification goals?"
    },
    "Loss Aversion": {
        "explanation": "A position has experienced a sustained drawdown while remaining in your portfolio past your initial reconsider timeline. Transaction records show continued holding despite negative performance.",
        "reflection_question": "Are you holding this asset because it meets your investment criteria today, or in anticipation of recovering your original purchase price?"
    },
    "Market Timing": {
        "explanation": "Multiple short-term entry and exit transactions were recorded around recent market swings. Short-term trading activity introduces execution costs and volatility exposure.",
        "reflection_question": "Are these short-term trades part of a systematic strategy, or impulsive responses to market noise?"
    }
}

class AIService:
    @staticmethod
    def generate_explanation(
        pattern_type: str,
        evidence: str,
        transaction_info: Optional[str] = None,
        market_info: Optional[str] = None,
        ml_result: Optional[Dict[str, Any]] = None
    ) -> Dict[str, str]:
        # If external AI API Key is provided, call external LLM
        if AI_API_KEY:
            try:
                prompt = (
                    f"You are an objective behavioral financial analyst for InvestGuard.\n"
                    f"Pattern Detected: {pattern_type}\n"
                    f"Evidence: {evidence}\n"
                    f"Transaction Context: {transaction_info or 'N/A'}\n"
                    f"Market Context: {market_info or 'N/A'}\n"
                    f"ML Anomaly Result: {ml_result or 'N/A'}\n\n"
                    f"Provide a neutral, factual 2-sentence explanation of what the data shows, without judging the user or making buy/sell recommendations.\n"
                    f"Follow with a single guided reflection question."
                )
                headers = {"Authorization": f"Bearer {AI_API_KEY}", "Content-Type": "application/json"}
                payload = {
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 150,
                    "temperature": 0.3
                }
                res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=4)
                if res.status_code == 200:
                    text = res.json()["choices"][0]["message"]["content"]
                    parts = text.split("Reflection question:")
                    exp = parts[0].strip()
                    ref = parts[1].strip() if len(parts) > 1 else "Was this decision part of your predefined plan?"
                    return {"explanation": exp, "reflection_question": ref}
            except Exception:
                pass

        # Robust Fallback Template AI
        template = EXPLANATION_TEMPLATES.get(pattern_type, {
            "explanation": f"Behavioral signal pattern '{pattern_type}' detected based on factual transaction logs and portfolio allocation metrics.",
            "reflection_question": "Was this transaction part of your predefined investment strategy?"
        })

        if evidence and len(evidence) > 10:
            custom_exp = f"{template['explanation']} Specific evidence observed: {evidence}"
        else:
            custom_exp = template['explanation']

        return {
            "explanation": custom_exp,
            "reflection_question": template["reflection_question"]
        }
