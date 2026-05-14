class ProfitOptimizationAgent:

    def optimize(self, order, risk_score):
        actions = []

        # Simulate ALLOW
        allow_profit = self.simulate_allow(
            order,
            risk_score
        )

        actions.append({
            "action": "ALLOW",
            "expected_profit": allow_profit
        })

        # Simulate VERIFY
        verify_profit = self.simulate_verify(
            order,
            risk_score
        )

        actions.append({
            "action": "VERIFY",
            "expected_profit": verify_profit
        })

        # Simulate PREPAID
        prepaid_profit = self.simulate_prepaid(
            order,
            risk_score
        )

        actions.append({
            "action": "CONVERT_TO_PREPAID",
            "expected_profit": prepaid_profit
        })

        # Simulate BLOCK
        block_profit = 0

        actions.append({
            "action": "BLOCK",
            "expected_profit": block_profit
        })

        # Best action
        best_action = max(
            actions,
            key=lambda x: x["expected_profit"]
        )

        return {
            "recommended_action":
                best_action["action"],

            "expected_profit":
                best_action["expected_profit"],

            "all_actions":
                sorted(
                    actions,
                    key=lambda x:
                        x["expected_profit"],
                    reverse=True
                )
        }

    def simulate_allow(
        self,
        order,
        risk_score
    ):
        base_profit = (
            order["order_value"] * 0.25
        )

        risk_penalty = (
            risk_score / 100
        ) * 500

        return round(
            base_profit - risk_penalty
        )

    def simulate_verify(
        self,
        order,
        risk_score
    ):
        base_profit = (
            order["order_value"] * 0.22
        )

        reduced_risk_penalty = (
            risk_score / 100
        ) * 250

        verification_cost = 40

        return round(
            base_profit
            - reduced_risk_penalty
            - verification_cost
        )

    def simulate_prepaid(
        self,
        order,
        risk_score
    ):
        base_profit = (
            order["order_value"] * 0.18
        )

        reduced_risk_penalty = (
            risk_score / 100
        ) * 100

        conversion_drop_penalty = 80

        return round(
            base_profit
            - reduced_risk_penalty
            - conversion_drop_penalty
        )
