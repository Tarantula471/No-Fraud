def get_action_plan(order, customer, risk_score):

    # Decision logic
    if risk_score > 85 and customer.total_rto >= 2:
        decision = "BLOCK_ORDER"

    elif risk_score > 70 and order.is_cod:
        decision = "CONVERT_TO_PREPAID"

    elif 40 < risk_score <= 70:
        decision = "VERIFY_BEFORE_SHIP"

    else:
        decision = "AUTO_APPROVE"

    # Action mapping
    if decision == "BLOCK_ORDER":
        actions = [
            "Cancel order",
            "Blacklist customer",
            "Disable COD for this user"
        ]
        impact = {"risk_reduction": "Very High", "revenue_impact": "Medium"}

    elif decision == "CONVERT_TO_PREPAID":
        actions = [
            "Send prepaid payment link",
            "Offer ₹50 prepaid discount",
            "Hold shipment"
        ]
        impact = {"risk_reduction": "High", "revenue_impact": "Low"}

    elif decision == "VERIFY_BEFORE_SHIP":
        actions = [
            "Send WhatsApp confirmation",
            "Call customer",
            "Delay shipment"
        ]
        impact = {"risk_reduction": "Medium", "revenue_impact": "Very Low"}

    else:
        actions = ["Proceed with shipping"]
        impact = {"risk_reduction": "None", "revenue_impact": "None"}

    return {
        "decision": decision,
        "actions": actions,
        "impact": impact
    }
