def calculate_risk(order, customer, pincode_stat=None):
    score = 0
    reasons = []

    # COD
    if order.is_cod:
        score += 25
        reasons.append("Cash on Delivery order")

    # Past RTO
    if customer.total_rto >= 2:
        score += 30
        reasons.append("Customer has multiple past RTOs")
    elif customer.total_rto == 1:
        score += 15
        reasons.append("Customer has 1 past RTO")

    # Discount
    if order.discount_percent > 40:
        score += 20
        reasons.append("High discount (>40%)")
    elif order.discount_percent > 20:
        score += 10
        reasons.append("Moderate discount (>20%)")

    # First time
    if customer.total_orders == 0:
        score += 10
        reasons.append("First-time customer")

    # Low value
    if order.order_value < 500:
        score += 10
        reasons.append("Low order value")

    # City tier
    if order.city_tier == "tier3":
        score += 8
        reasons.append("Tier 3 city")

    if pincode_stat:
        rto_rate = float(pincode_stat.rto_rate)

        if rto_rate >= 40:
            score += 20
            reasons.append("Very high RTO area (>40%)")
        elif rto_rate >= 25:
            score += 15
            reasons.append("High RTO area (>25%)")
        elif rto_rate >= 15:
            score += 10
            reasons.append("Moderate RTO area (>15%)")
        elif rto_rate >= 8:
            score += 5
            reasons.append("Slightly risky area (>8%)")

    # Cap
    score = min(score, 100)

    # Level
    if score <= 30:
        level = "SAFE"
        action = "Proceed normally"
    elif score <= 70:
        level = "MEDIUM"
        action = "Send confirmation message"
    else:
        level = "HIGH"
        action = "Call customer before shipping"

    return {
        "score": score,
        "level": level,
        "reasons": reasons,
        "action": action
    }
