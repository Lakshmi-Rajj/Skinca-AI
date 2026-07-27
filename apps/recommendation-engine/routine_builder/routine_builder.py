from typing import List, Tuple
from models.request import RecommendationRequest
from models.response import RecommendedProduct, Routine


class RoutineBuilder:
    """Stage 5: Assembles Morning and Evening routines ordered by dermatological application sequence."""

    MORNING_SEQUENCE = ["CLEANSER", "TONER", "SERUM", "MOISTURIZER", "SUNSCREEN"]
    EVENING_SEQUENCE = ["CLEANSER", "TONER", "SERUM", "MOISTURIZER", "MASK"]

    @staticmethod
    def build_routines(
        request: RecommendationRequest,
        ranked_products: List[RecommendedProduct],
    ) -> Tuple[Routine, Routine]:
        morning_steps: List[RecommendedProduct] = []
        evening_steps: List[RecommendedProduct] = []

        cfg = request.tenant_config

        # Categorize products by category
        by_category = {}
        for p in ranked_products:
            cat = p.category.upper()
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(p)

        # Build Morning Routine
        morning_missing: List[str] = []
        for step in RoutineBuilder.MORNING_SEQUENCE:
            if step in by_category and len(by_category[step]) > 0:
                if len(morning_steps) < cfg.max_morning_products:
                    morning_steps.append(by_category[step][0])
            else:
                morning_missing.append(step.capitalize())

        morning_cost = sum(p.price for p in morning_steps)
        morning_routine = Routine(
            routine_type="MORNING",
            steps=morning_steps,
            missing_steps=morning_missing,
            total_cost=round(morning_cost, 2),
        )

        # Build Evening Routine
        evening_missing: List[str] = []
        for step in RoutineBuilder.EVENING_SEQUENCE:
            if step in by_category and len(by_category[step]) > 0:
                if len(evening_steps) < cfg.max_evening_products:
                    # Pick highest scoring product not already used or fallback
                    candidate = by_category[step][0]
                    evening_steps.append(candidate)
            else:
                evening_missing.append(step.capitalize())

        evening_cost = sum(p.price for p in evening_steps)
        evening_routine = Routine(
            routine_type="EVENING",
            steps=evening_steps,
            missing_steps=evening_missing,
            total_cost=round(evening_cost, 2),
        )

        return morning_routine, evening_routine
