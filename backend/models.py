from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from db import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String)
    phone = Column(String)

    total_orders = Column(Integer, default=0)
    total_rto = Column(Integer, default=0)
    total_returns = Column(Integer, default=0)


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"))

    order_value = Column(Numeric)
    discount_percent = Column(Numeric)
    items_count = Column(Integer)

    is_cod = Column(Boolean)

    shipping_pincode = Column(String)
    city = Column(String)
    city_tier = Column(String)

    status = Column(String, default="pending")


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))

    risk_score = Column(Integer)
    risk_level = Column(String)
    reasons = Column(JSON)
    recommended_action = Column(String)

class PincodeStats(Base):
    __tablename__ = "pincode_stats"

    pincode = Column(String, primary_key=True)
    total_orders = Column(Integer, default=0)
    total_rto = Column(Integer, default=0)
    rto_rate = Column(Numeric)
