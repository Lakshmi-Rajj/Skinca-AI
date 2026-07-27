from typing import List
from models.request import RecommendationRequest
from models.response import RecommendationResponse, RecommendedProduct, RejectedProduct
from eligibility.eligibility_filter import EligibilityFilter
from contraindications.contraindication_checker import ContraindicationChecker
from ingredient_matcher.ingredient_matcher import IngredientMatcher
from scoring.scoring_engine import ScoringEngine
from routine_builder.routine_builder import RoutineBuilder
from explainability.explainability_generator import ExplainabilityGenerator


class RecommendationEngine:
    """Pure, deterministic skincare recommendation decision engine.

    Pipeline Stages:
    1. Eligibility Filter
    2. Contraindication Checker
    3. Ingredient & Concern Matcher
    4. Weighted Scoring Model
    5. Routine Builder (Morning / Evening)
    6. Machine-Readable Explainability Generator
    """

    def evaluate(self, request: RecommendationRequest) -> RecommendationResponse:
        # Stage 1: Eligibility Filter
        stage1_eligible, stage1_rejected = EligibilityFilter.filter_eligible_products(request)

        # Stage 2: Contraindication Checker
        stage2_safe, stage2_rejected = ContraindicationChecker.check_contraindications(request, stage1_eligible)

        all_rejected: List[RejectedProduct] = stage1_rejected + stage2_rejected

        # Stage 3 & 4: Ingredient Matching & Weighted Scoring
        ranked_products: List[RecommendedProduct] = []
        for product in stage2_safe:
            matched_data = IngredientMatcher.match_product_attributes(request, product)
            scored_product = ScoringEngine.score_product(request, product, matched_data)
            ranked_products.append(scored_product)

        # Sort strictly by total_score descending (deterministic tie-breaking by name)
        ranked_products.sort(key=lambda p: (-p.total_score, p.name))

        # Stage 5: Routine Builder
        morning_routine, evening_routine = RoutineBuilder.build_routines(request, ranked_products)

        # Stage 6: Explainability Generator
        explanation = ExplainabilityGenerator.generate_explanation(
            request,
            eligible_count=len(stage2_safe),
            rejected_products=all_rejected,
            ranked_products=ranked_products,
        )

        return RecommendationResponse(
            success=True,
            morning_routine=morning_routine,
            evening_routine=evening_routine,
            all_ranked_products=ranked_products,
            rejected_products=all_rejected,
            explanation=explanation,
        )
