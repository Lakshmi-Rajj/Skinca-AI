from typing import List, Tuple
from models.request import CandidateProduct, RecommendationRequest
from models.response import RejectedProduct


class EligibilityFilter:
    """Stage 1: Filters candidate products based on availability, status, and skin type compatibility."""

    @staticmethod
    def filter_eligible_products(
        request: RecommendationRequest,
    ) -> Tuple[List[CandidateProduct], List[RejectedProduct]]:
        eligible: List[CandidateProduct] = []
        rejected: List[RejectedProduct] = []

        user_skin_type = request.skin_type.upper()

        for product in request.candidate_products:
            # 1. Status check
            if product.status.upper() != "ACTIVE":
                rejected.append(
                    RejectedProduct(
                        product_id=product.id,
                        name=product.name,
                        rejection_reason=f"Product status is '{product.status}', must be ACTIVE",
                    )
                )
                continue

            # 2. Skin type compatibility check
            if product.compatible_skin_types:
                compatible_types = [t.upper() for t in product.compatible_skin_types]
                if user_skin_type not in compatible_types and "ALL" not in compatible_types:
                    rejected.append(
                        RejectedProduct(
                            product_id=product.id,
                            name=product.name,
                            rejection_reason=f"Incompatible with user skin type '{user_skin_type}'",
                        )
                    )
                    continue

            eligible.append(product)

        return eligible, rejected
