from typing import List
from models.request import RecommendationRequest
from models.response import RecommendedProduct, RejectedProduct, Explanation


class ExplainabilityGenerator:
    """Stage 6: Generates machine-readable, reproducible explanation summaries without LLM dependence."""

    @staticmethod
    def generate_explanation(
        request: RecommendationRequest,
        eligible_count: int,
        rejected_products: List[RejectedProduct],
        ranked_products: List[RecommendedProduct],
    ) -> Explanation:
        bullets: List[str] = []

        bullets.append(f"Evaluated skin profile: {request.skin_type} skin with concerns [{', '.join(request.skin_concerns)}].")

        if request.allergies:
            bullets.append(f"Filtered out products containing declared allergens: [{', '.join(request.allergies)}].")

        if request.excluded_ingredients:
            bullets.append(f"Filtered out products containing user-excluded ingredients: [{', '.join(request.excluded_ingredients)}].")

        if len(rejected_products) > 0:
            bullets.append(f"Rejected {len(rejected_products)} candidate products due to status, skin type mismatch, or contraindications.")

        if len(ranked_products) > 0:
            top = ranked_products[0]
            bullets.append(f"Top recommended product: '{top.name}' (Score: {top.total_score}/100) targeting [{', '.join(top.matched_concerns)}].")

        return Explanation(
            summary_bullets=bullets,
            total_candidates_evaluated=len(request.candidate_products),
            total_eligible_products=eligible_count,
            total_rejected_products=len(rejected_products),
        )
