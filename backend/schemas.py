from pydantic import BaseModel
from uuid import UUID
from typing import List

class OrderCreate(BaseModel):
    customer_id: UUID
    order_value: float
    discount_percent: float
    items_count: int
    is_cod: bool
    shipping_pincode: str
    city: str
    city_tier: str


class RiskResponse(BaseModel):
    order_id: UUID
    risk_score: int
    risk_level: str
    reasons: List[str]
    recommended_action: str
