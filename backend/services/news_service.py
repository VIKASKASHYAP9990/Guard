import os
import requests
from typing import List, Dict, Any

NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")

MOCK_NEWS: Dict[str, List[Dict[str, Any]]] = {
    "AAPL": [
        {
            "title": "Apple Unveils Next-Gen Silicon and AI Enhancements at Global Keynote",
            "source": "TechDaily",
            "timestamp": "2 hours ago",
            "url": "https://example.com/news/apple-ai",
            "summary": "Apple announced major on-device hardware upgrades focused on Machine Learning workloads."
        },
        {
            "title": "Analyst Upgrades AAPL Following Strong Quarterly Services Growth",
            "source": "Financial Pulse",
            "timestamp": "1 day ago",
            "url": "https://example.com/news/apple-upgrade",
            "summary": "Subscription revenue surged 18% year-over-year, outperforming market estimates."
        }
    ],
    "NVDA": [
        {
            "title": "NVIDIA Surpasses Expectations on Enterprise Data Center Demand",
            "source": "MarketWatch",
            "timestamp": "3 hours ago",
            "url": "https://example.com/news/nvda-datacenter",
            "summary": "Demand for next-gen GPUs remains elevated across enterprise tech sectors."
        }
    ],
    "TSLA": [
        {
            "title": "Tesla Announces Production Adjustment for Q3 Assembly Lines",
            "source": "AutoNews Wire",
            "timestamp": "5 hours ago",
            "url": "https://example.com/news/tesla-q3",
            "summary": "Temporary retooling planned across main gigafactory facilities."
        }
    ]
}

class NewsService:
    @staticmethod
    def get_company_news(symbol: str) -> List[Dict[str, Any]]:
        symbol = symbol.upper()
        if NEWS_API_KEY:
            try:
                res = requests.get(f"https://newsapi.org/v2/everything?q={symbol}&apiKey={NEWS_API_KEY}", timeout=3)
                if res.status_code == 200:
                    articles = res.json().get("articles", [])
                    return [
                        {
                            "title": a.get("title", ""),
                            "source": a.get("source", {}).get("name", "News"),
                            "timestamp": a.get("publishedAt", ""),
                            "url": a.get("url", "#"),
                            "summary": a.get("description", "")
                        }
                        for a in articles[:5]
                    ]
            except Exception:
                pass
        return MOCK_NEWS.get(symbol, [
            {
                "title": f"Market Analysis for {symbol}: Recent Volume & Earnings Digest",
                "source": "FinNews Express",
                "timestamp": "Yesterday",
                "url": "#",
                "summary": f"Recent activity in {symbol} reflects broader market trends and economic releases."
            }
        ])

    @staticmethod
    def get_recent_headlines(symbol: str) -> List[str]:
        articles = NewsService.get_company_news(symbol)
        return [a["title"] for a in articles]
