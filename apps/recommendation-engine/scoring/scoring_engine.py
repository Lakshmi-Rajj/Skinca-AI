from typing import Dict, Any
from models.request import CandidateProduct, RecommendationRequest
from models.response import RecommendedProduct, ScoreBreakdown


class ScoringEngine:
    """Stage 4: Evaluates candidate products against configurable weighted scoring sub-models."""

    @staticmethod
    def score_product(
        request: RecommendationRequest,
        product: CandidateProduct,
        matched_data: Dict[str, Any],
    ) -> RecommendedProduct:
        cfg = request.tenant_config

        # 1. Compatibility Score (0 - 100)
        compatibility_score = 100.0
        if product.compatible_skin_types:
            compat = [t.upper() for t in product.compatible_skin_types]
            if request.skin_type.upper() in compat:
                compatibility_score = 100.0
            elif "ALL" in compat:
                compatibility_score = 90.0
            else:
                compatibility_score = 50.0

        # 2. Concern Coverage Score (0 - 100)
        total_user_concerns = len(request.skin_concerns)
        matched_concerns_count = len(matched_data["matched_concerns"])
        if total_user_concerns > 0:
            concern_coverage_score = min(100.0, (matched_concerns_count / total_user_concerns) * 100.0)
        else:
            concern_coverage_score = 80.0

        # 3. Safety Score (0 - 100)
        high_risk_count = 0
        for ing in product.ingredients:
            if ing.irritation_risk.upper() == "HIGH":
                high_risk_count += 1

        safety_score = 100.0
        if request.sensitivity_level.upper() == "HIGH":
            safety_score -= high_risk_count * 35.0
        elif request.sensitivity_level.upper() == "MEDIUM":
            safety_score -= high_risk_count * 20.0
        else:
            safety_score -= high_risk_count * 10.0

        safety_score = max(0.0, safety_score)

        # 4. Ingredient Quality Score (0 - 100)
        primary_active_count = sum(1 for ing in product.ingredients if ing.is_primary_active)
        ingredient_quality_score = min(100.0, 60.0 + (primary_active_count * 20.0))

        # Weighted Total Sum
        total_weight = (
            cfg.weight_compatibility
            + cfg.weight_concern_coverage
            + cfg.weight_safety
            + cfg.weight_ingredient_quality
        )

        total_score = (
            (compatibility_score * cfg.weight_compatibility)
            + (concern_coverage_score * cfg.weight_concern_coverage)
            + (safety_score * cfg.weight_safety)
            + (ingredient_quality_score * cfg.weight_ingredient_quality)
        ) / (total_weight if total_weight > 0 else 100.0)

        breakdown = ScoreBreakdown(
            compatibility_score=round(compatibility_score, 2),
            concern_coverage_score=round(concern_coverage_score, 2),
            safety_score=round(safety_score, 2),
            ingredient_quality_score=round(ingredient_quality_score, 2),
        )

        return RecommendedProduct(
            product_id=product.id,
            name=product.name,
            category=product.category,
            price=product.price,
            total_score=round(total_score, 2),
            score_breakdown=breakdown,
            matched_concerns=matched_data["matched_concerns"],
            matched_ingredients=matched_data["matched_ingredients"],
        )
