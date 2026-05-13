def generate_reasoning(order, risk_score):
    factors = []

    # Pincode risk
    if order.pincode_risk > 70:
        factors.append(
            "High-risk delivery pincode detected"
        )

    # COD
    if order.payment_method == "COD":
        factors.append(
            "Cash-on-delivery orders have elevated RTO probability"
        )

    # High order value
    if order.order_value > 5000:
        factors.append(
            "High-value order increases potential loss exposure"
        )

    # Previous failures
    if order.previous_failed_deliveries > 1:
        factors.append(
            "Customer has multiple failed delivery attempts"
        )

    # Risk score explanation
    if risk_score > 85:
        summary = (
            "AI detected a high probability of operational loss"
        )

        confidence = (
            "Multiple strong risk indicators aligned"
        )

    elif risk_score > 60:
        summary = (
            "AI detected moderate operational risk"
        )

        confidence = (
            "Some risk signals were identified"
        )

    else:
        summary = (
            "Order appears operationally safe"
        )

        confidence = (
            "No major risk indicators detected"
        )

    return {
        "summary": summary,
        "factors": factors,
        "confidence_explanation": confidence,
    }
