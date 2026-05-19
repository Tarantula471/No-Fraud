from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models import Order, Customer, RiskScore, PincodeStats
from services.risk_engine import calculate_risk
from services.action_engine import get_action_plan
from services.profit_engine import get_profit_decision
from websocket_manager import manager
from services.reasoning_engine import generate_reasoning
from agents.risk_agent import (
    RiskInvestigationAgent
)
from agents.profit_agent import (
    ProfitOptimizationAgent
)
from services.similarity_engine import (
    SimilarityEngine
)

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

    agent = RiskInvestigationAgent()

    agent_result = agent.investigate(order)

    profit_agent = ProfitOptimizationAgent()

    profit_result = profit_agent.optimize(
        order,
        risk_score
    )

    result = calculate_risk(order, customer, pincode_stat)
    # Combine agent intelligence
    result["reasons"].extend(
        agent_result["signals"]
    )

    result["score"] += (
        agent_result["extra_risk"]
    )
    action_plan = get_action_plan(order, customer, result["score"])
    profit_data = get_profit_decision(order, result["score"])
    sorted_actions = sorted(
        profit_data["all_actions"],
        key=lambda x: x["profit"],
        reverse=True
    )
    reasoning = generate_reasoning(order, risk_score)

    risk_entry = RiskScore(
        order_id=order.id,
        risk_score=result["score"],
        risk_level=result["level"],
        reasons=result["reasons"],
        recommended_action=result["action"]
    )

    db.add(risk_entry)
    db.commit()

    similarity_engine = SimilarityEngine()

    similar_cases =
        similarity_engine.find_similar_cases(
            order,
            historical_orders
        )

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
        },

        "ai_reasoning": reasoning,
        "agent_analysis": agent_result,
        "profit_agent": profit_result,
        "similar_cases": similar_cases
    }

    await manager.broadcast(response)
    return response


@router.get("/risk/order/{order_id}")
def get_risk(order_id: str, db: Session = Depends(get_db)):
    risk = db.query(RiskScore).filter(RiskScore.order_id == order_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")

    return risk
