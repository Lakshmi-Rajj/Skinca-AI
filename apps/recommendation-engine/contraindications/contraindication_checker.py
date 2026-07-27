from typing import List, Tuple
from models.request import CandidateProduct, RecommendationRequest
from models.response import RejectedProduct


class ContraindicationChecker:
    """Stage 2: Rejects products containing declared allergens or user-excluded ingredients."""

    @staticmethod
    def check_contraindications(
        request: RecommendationRequest,
        candidates: List[CandidateProduct],
    ) -> Tuple[List[CandidateProduct], List[RejectedProduct]]:
        safe: List[CandidateProduct] = []
        rejected: List[RejectedProduct] = []

        user_allergies = [a.lower().strip() for a in request.allergies]
        user_exclusions = [e.lower().strip() for e in request.excluded_ingredients]

        for product in candidates:
            conflict_found = False

            for ingredient in product.ingredients:
                inci = ingredient.inci_name.lower().strip()
                display = ingredient.display_name.lower().strip()

                # Check Allergies
                for allergen in user_allergies:
                    if allergen in inci or allergen in display:
                        rejected.append(
                            RejectedProduct(
                                product_id=product.id,
                                name=product.name,
                                rejection_reason=f"Contains declared allergen '{ingredient.display_name}'",
                                conflicting_ingredient=ingredient.inci_name,
                            )
                        )
                        conflict_found = True
                        break

                if conflict_found:
                    break

                # Check Excluded Ingredients
                for exclusion in user_exclusions:
                    if exclusion in inci or exclusion in display:
                        rejected.append(
                            RejectedProduct(
                                product_id=product.id,
                                name=product.name,
                                rejection_reason=f"Contains user-excluded ingredient '{ingredient.display_name}'",
                                conflicting_ingredient=ingredient.inci_name,
                            )
                        )
                        conflict_found = True
                        break

                if conflict_found:
                    break

            if not conflict_found:
                safe.append(product)

        return safe, rejected
