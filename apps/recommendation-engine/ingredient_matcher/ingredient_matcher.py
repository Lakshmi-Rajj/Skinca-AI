from typing import List, Set, Dict, Any
from models.request import CandidateProduct, RecommendationRequest


class IngredientMatcher:
    """Stage 3: Matches candidate products against user skin concerns and ingredient skin type compatibility."""

    @staticmethod
    def match_product_attributes(
        request: RecommendationRequest,
        product: CandidateProduct,
    ) -> Dict[str, Any]:
        user_concerns = {c.upper() for c in request.skin_concerns}
        matched_concerns: Set[str] = set()
        matched_ingredients: Set[str] = set()

        # Direct product level target skin concerns match
        for concern in product.target_skin_concerns:
            if concern.upper() in user_concerns:
                matched_concerns.add(concern.upper())

        # Ingredient level skin concern and skin type match
        for ingredient in product.ingredients:
            ing_concerns = {c.upper() for c in ingredient.skin_concerns}
            overlap = user_concerns.intersection(ing_concerns)

            if overlap:
                matched_concerns.update(overlap)
                matched_ingredients.add(ingredient.display_name)

        return {
            "matched_concerns": sorted(list(matched_concerns)),
            "matched_ingredients": sorted(list(matched_ingredients)),
        }
