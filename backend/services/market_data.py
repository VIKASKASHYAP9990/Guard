import os
import random
import requests
from typing import Dict, List, Any

MARKET_DATA_API_KEY = os.getenv("MARKET_DATA_API_KEY", "")
MARKET_DATA_BASE_URL = os.getenv("MARKET_DATA_BASE_URL", "https://api.marketdata.example.com")

MOCK_MARKET_DATA: Dict[str, Dict[str, Any]] = {
    "AAPL": {
        "company": "Apple Inc.",
        "current_price": 224.50,
        "change": 3.20,
        "change_percent": 1.45,
        "volume": 48200000,
        "high_52w": 237.23,
        "low_52w": 164.08,
        "sector": "Technology",
        "history": [215.0, 218.2, 220.1, 219.5, 221.8, 224.5]
    },
    "MSFT": {
        "company": "Microsoft Corp.",
        "current_price": 448.20,
        "change": -2.10,
        "change_percent": -0.47,
        "volume": 18400000,
        "high_52w": 468.35,
        "low_52w": 309.45,
        "sector": "Technology",
        "history": [452.0, 451.1, 449.5, 450.3, 448.2]
    },
    "NVDA": {
        "company": "NVIDIA Corporation",
        "current_price": 128.40,
        "change": 8.75,
        "change_percent": 7.31,
        "volume": 85000000,
        "high_52w": 140.76,
        "low_52w": 40.85,
        "sector": "Semiconductors",
        "history": [112.0, 115.4, 118.9, 122.1, 128.4]
    },
    "TSLA": {
        "company": "Tesla, Inc.",
        "current_price": 248.80,
        "change": -18.40,
        "change_percent": -6.89,
        "volume": 62000000,
        "high_52w": 271.00,
        "low_52w": 138.80,
        "sector": "Automotive",
        "history": [275.0, 268.2, 260.1, 255.0, 248.8]
    },
    "AMZN": {
        "company": "Amazon.com Inc.",
        "current_price": 186.30,
        "change": 1.40,
        "change_percent": 0.76,
        "volume": 29000000,
        "high_52w": 201.20,
        "low_52w": 118.35,
        "sector": "Consumer Discretionary",
        "history": [182.0, 183.5, 185.1, 184.9, 186.3]
    },
    "GOOGL": {
        "company": "Alphabet Inc.",
        "current_price": 178.90,
        "change": 0.80,
        "change_percent": 0.45,
        "volume": 21000000,
        "high_52w": 191.75,
        "low_52w": 120.21,
        "sector": "Communication Services",
        "history": [176.5, 177.0, 178.1, 178.2, 178.9]
    },
    "RELIANCE": {
        "company": "Reliance Industries Ltd.",
        "current_price": 2980.50,
        "change": 45.20,
        "change_percent": 1.54,
        "volume": 8400000,
        "high_52w": 3217.90,
        "low_52w": 2220.30,
        "sector": "Energy",
        "history": [2910.0, 2925.0, 2940.0, 2965.0, 2980.5]
    },
    "TATAMOTORS": {
        "company": "Tata Motors Ltd.",
        "current_price": 985.40,
        "change": -62.10,
        "change_percent": -5.93,
        "volume": 12500000,
        "high_52w": 1179.00,
        "low_52w": 612.00,
        "sector": "Automotive",
        "history": [1060.0, 1045.0, 1020.0, 1000.0, 985.4]
    }
}


class MarketDataService:
    @staticmethod
    def get_current_price(symbol: str) -> float:
        symbol = symbol.upper()
        if MARKET_DATA_API_KEY:
            try:
                res = requests.get(f"{MARKET_DATA_BASE_URL}/quote/{symbol}?apikey={MARKET_DATA_API_KEY}", timeout=3)
                if res.status_code == 200:
                    data = res.json()
                    return float(data.get("price", MOCK_MARKET_DATA.get(symbol, {}).get("current_price", 100.0)))
            except Exception:
                pass
        return MOCK_MARKET_DATA.get(symbol, {}).get("current_price", 150.0)

    @staticmethod
    def get_historical_prices(symbol: str, days: int = 7) -> List[float]:
        symbol = symbol.upper()
        if MARKET_DATA_API_KEY:
            try:
                res = requests.get(f"{MARKET_DATA_BASE_URL}/history/{symbol}?apikey={MARKET_DATA_API_KEY}", timeout=3)
                if res.status_code == 200:
                    data = res.json()
                    return data.get("prices", MOCK_MARKET_DATA.get(symbol, {}).get("history", [100.0] * days))
            except Exception:
                pass
        base_history = MOCK_MARKET_DATA.get(symbol, {}).get("history", [150.0, 152.0, 151.0, 153.0, 155.0])
        return base_history[-days:] if len(base_history) >= days else base_history

    @staticmethod
    def get_price_change(symbol: str) -> Dict[str, float]:
        symbol = symbol.upper()
        info = MOCK_MARKET_DATA.get(symbol, {
            "change": 1.5,
            "change_percent": 1.0,
            "current_price": 150.0
        })
        return {
            "change": info.get("change", 1.5),
            "change_percent": info.get("change_percent", 1.0),
            "current_price": info.get("current_price", 150.0)
        }

    @staticmethod
    def get_volume(symbol: str) -> int:
        symbol = symbol.upper()
        return MOCK_MARKET_DATA.get(symbol, {}).get("volume", 10000000)

    @staticmethod
    def get_full_quote(symbol: str) -> Dict[str, Any]:
        symbol = symbol.upper()
        data = MOCK_MARKET_DATA.get(symbol)
        if not data:
            data = {
                "company": f"{symbol} Corp",
                "current_price": 150.0,
                "change": 2.5,
                "change_percent": 1.69,
                "volume": 12000000,
                "high_52w": 180.0,
                "low_52w": 120.0,
                "sector": "General Finance"
            }
        return {
            "symbol": symbol,
            "company": data["company"],
            "current_price": data["current_price"],
            "change": data["change"],
            "change_percent": data["change_percent"],
            "volume": data["volume"],
            "high_52w": data.get("high_52w", data["current_price"] * 1.2),
            "low_52w": data.get("low_52w", data["current_price"] * 0.8),
            "sector": data.get("sector", "General")
        }
