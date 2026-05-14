class RiskInvestigationAgent:

    def investigate(self, order):
        findings = []

        # Check pincode
        if order["pincode_risk"] > 70:
            findings.append({
                "severity": "HIGH",
                "finding":
                "High-risk pincode detected"
            })

        # COD risk
        if order["payment_method"] == "COD":
            findings.append({
                "severity": "MEDIUM",
                "finding":
                "COD orders historically show higher RTO"
            })

        # Failed deliveries
        if order["failed_deliveries"] > 1:
            findings.append({
                "severity": "HIGH",
                "finding":
                "Customer has repeated failed deliveries"
            })

        # Generate recommendation
        recommendation = self.generate_action(
            findings
        )

        return {
            "findings": findings,
            "recommendation": recommendation,
            "confidence": "HIGH"
        }

    def generate_action(self, findings):
        high_count = len([
            f for f in findings
            if f["severity"] == "HIGH"
        ])

        if high_count >= 2:
            return "VERIFY"

        if high_count >= 3:
            return "BLOCK"

        return "ALLOW"
