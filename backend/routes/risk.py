from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models import Order, Customer, RiskScore, PincodeStats
from services.risk_engine import calculate_risk
from services.action_engine import get_action_plan
from services.profit_engine import get_profit_decision
from websocket_manager import manager

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/risk/score-order")
async def score_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()

    pincode_stat = db.query(PincodeStats).filter(
        PincodeStats.pincode == order.shipping_pincode
    ).first()

    result = calculate_risk(order, customer, pincode_stat)
    action_plan = get_action_plan(order, customer, result["score"])
    profit_data = get_profit_decision(order, result["score"])
    sorted_actions = sorted(
        profit_data["all_actions"],
        key=lambda x: x["profit"],
        reverse=True
    )

    risk_entry = RiskScore(
        order_id=order.id,
        risk_score=result["score"],
        risk_level=result["level"],
        reasons=result["reasons"],
        recommended_action=result["action"]
    )

    db.add(risk_entry)
    db.commit()

    response = {
        "order_id": str(order.id),

        "risk": {
            "score": result["score"],
            "level": result["level"],
            "probability_of_rto": profit_data["prob_rto"],
            "reasons": result["reasons"]
        },

        "decision": {
            "recommended_action": profit_data["best_action"],
            "confidence": "HIGH" if result["score"] > 70 else "MEDIUM",
            "alternatives": [
                {
                    "action": a["action"],
                    "expected_profit": a["profit"]
                }
                for a in sorted_actions
            ]
        },

        "business_impact": {
            "expected_profit": profit_data["expected_profit"],
            "risk_cost": round(profit_data["prob_rto"] * 150, 2),
            "notes": "Decision optimized for maximum expected profit"
        }
    }

    await manager.broadcast(response)
    return response


@router.get("/risk/order/{order_id}")
def get_risk(order_id: str, db: Session = Depends(get_db)):
    risk = db.query(RiskScore).filter(RiskScore.order_id == order_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")

    return risk
