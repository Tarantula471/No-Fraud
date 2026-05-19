class SimilarityEngine:

    def find_similar_cases(
        self,
        order,
        historical_orders
    ):
        scored_cases = []

        for hist in historical_orders:
            similarity = 0

            # Payment match
            if (
                hist["payment_method"]
                ==
                order["payment_method"]
            ):
                similarity += 30

            # Pincode risk similarity
            similarity += max(
                0,
                30 - abs(
                    hist["pincode_risk"]
                    -
                    order["pincode_risk"]
                )
            )

            # Order value similarity
            similarity += max(
                0,
                20 - abs(
                    hist["order_value"]
                    -
                    order["order_value"]
                ) / 500
            )

            # Failed deliveries similarity
            similarity += max(
                0,
                20 - abs(
                    hist["failed_deliveries"]
                    -
                    order["failed_deliveries"]
                ) * 5
            )

            scored_cases.append({
                "case": hist,
                "similarity": round(similarity)
            })

        ranked = sorted(
            scored_cases,
            key=lambda x:
                x["similarity"],
            reverse=True
        )

        return ranked[:3]
