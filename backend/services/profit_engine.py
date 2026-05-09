def risk_to_probability(score):
    return score / 100.0


def get_profit_decision(order, risk_score):
    order_value = float(order.order_value)
    prob_rto = risk_to_probability(risk_score)

    SHIPPING_COST = 100
    RTO_COST = 150
    VERIFY_COST = 10
    PREPAID_INCENTIVE = 50
    CONVERSION_RATE = 0.4

    # 1. ALLOW
    profit_allow = order_value - (prob_rto * RTO_COST)

    # 2. VERIFY
    reduced_risk = prob_rto * 0.6
    profit_verify = order_value - (reduced_risk * RTO_COST) - VERIFY_COST

    # 3. CONVERT
    profit_convert = (
        CONVERSION_RATE * (order_value - PREPAID_INCENTIVE)
    )

    # 4. BLOCK
    profit_block = 0

    results = [
        {"action": "ALLOW", "profit": round(profit_allow, 2)},
        {"action": "VERIFY", "profit": round(profit_verify, 2)},
        {"action": "CONVERT_TO_PREPAID", "profit": round(profit_convert, 2)},
        {"action": "BLOCK", "profit": round(profit_block, 2)}
    ]

    best = max(results, key=lambda x: x["profit"])

    return {
        "best_action": best["action"],
        "expected_profit": best["profit"],
        "all_actions": results,
        "prob_rto": round(prob_rto, 2)
    }
