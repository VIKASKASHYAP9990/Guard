from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Holding Schemas
class HoldingBase(BaseModel):
    symbol: str
    company: str
    quantity: float
    average_buy_price: float
    current_price: float
    sector: str

class HoldingCreate(HoldingBase):
    pass

class HoldingResponse(HoldingBase):
    id: int
    user_id: int
    current_value: float
    gain_loss: float
    gain_loss_percent: float
    portfolio_percent: float
    model_config = ConfigDict(from_attributes=True)

# Transaction Schemas
class TransactionBase(BaseModel):
    symbol: str
    company: str
    type: str  # BUY or SELL
    quantity: float
    price: float
    reason: Optional[str] = None
    expected_holding_period: Optional[str] = None

class TransactionCreate(TransactionBase):
    date: Optional[datetime] = None

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    date: datetime
    total_amount: float
    model_config = ConfigDict(from_attributes=True)

# Behavior Analysis & Alert Schemas
class BehaviorAnalysisResponse(BaseModel):
    id: int
    user_id: int
    pattern_type: str
    severity: str
    evidence: str
    detected_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AlertResponse(BaseModel):
    id: int
    user_id: int
    pattern_type: str
    title: str
    description: str
    evidence: str
    reflection_question: str
    severity: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AlertUpdate(BaseModel):
    status: str  # Unread, Reviewed, Dismissed

# Journal Schemas
class JournalCreate(BaseModel):
    symbol: str
    thesis: str
    holding_period: str
    reconsider_condition: str
    reflection: Optional[str] = None

class JournalResponse(JournalCreate):
    id: int
    user_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Planner Schemas
class PlannerCreate(BaseModel):
    monthly_income: float
    monthly_expenses: float
    existing_savings: float
    desired_contribution: float
    horizon_years: int = 5

class PlannerResponse(PlannerCreate):
    id: int
    user_id: int
    available_monthly: float
    total_1yr: float
    total_3yr: float
    total_5yr: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Market & AI Schemas
class MarketQuote(BaseModel):
    symbol: str
    company: str
    current_price: float
    change: float
    change_percent: float
    volume: int
    high_52w: float
    low_52w: float
    sector: str

class NewsItem(BaseModel):
    title: str
    source: str
    timestamp: str
    url: str
    summary: str

class AIExplainRequest(BaseModel):
    pattern_type: str
    evidence: str
    transaction_id: Optional[int] = None
    holding_symbol: Optional[str] = None

class AIExplainResponse(BaseModel):
    explanation: str
    reflection_question: str
