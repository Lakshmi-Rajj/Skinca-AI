import unittest
from models.request import RecommendationRequest, CandidateProduct, ProductIngredientItem, TenantRuleConfig
from engine import RecommendationEngine


class TestEnginePipeline(unittest.TestCase):
    def test_deterministic_pipeline_execution(self):
        engine = RecommendationEngine()

        req = RecommendationRequest(
            tenant_id="demo-tenant",
            skin_type="DRY",
            skin_concerns=["DEHYDRATION", "BARRIER_REPAIR"],
            sensitivity_level="LOW",
            allergies=["Salicylic Acid"],
            excluded_ingredients=[],
            tenant_config=TenantRuleConfig(
                weight_compatibility=40.0,
                weight_concern_coverage=25.0,
                weight_safety=20.0,
                weight_ingredient_quality=15.0,
            ),
            candidate_products=[
                CandidateProduct(
                    id="p1",
                    name="HA Deep Hydration Serum",
                    category="SERUM",
                    status="ACTIVE",
                    price=48.0,
                    compatible_skin_types=["DRY", "NORMAL"],
                    target_skin_concerns=["DEHYDRATION"],
                    ingredients=[
                        ProductIngredientItem(
                            ingredient_id="i1",
                            inci_name="Sodium Hyaluronate",
                            display_name="Hyaluronic Acid",
                            skin_concerns=["DEHYDRATION", "BARRIER_REPAIR"],
                            is_primary_active=True,
                        )
                    ],
                ),
                CandidateProduct(
                    id="p2",
                    name="Ceramide Barrier Cream",
                    category="MOISTURIZER",
                    status="ACTIVE",
                    price=52.0,
                    compatible_skin_types=["DRY", "SENSITIVE"],
                    target_skin_concerns=["BARRIER_REPAIR"],
                    ingredients=[
                        ProductIngredientItem(
                            ingredient_id="i2",
                            inci_name="Ceramide NP",
                            display_name="Ceramide NP",
                            skin_concerns=["BARRIER_REPAIR", "DEHYDRATION"],
                            is_primary_active=True,
                        )
                    ],
                ),
                CandidateProduct(
                    id="p3",
                    name="BHA Pore Exfoliant",
                    category="SERUM",
                    status="ACTIVE",
                    price=30.0,
                    compatible_skin_types=["OILY"],
                    ingredients=[
                        ProductIngredientItem(
                            ingredient_id="i3",
                            inci_name="Salicylic Acid",
                            display_name="Salicylic Acid",
                        )
                    ],
                ),
            ],
        )

        res1 = engine.evaluate(req)
        res2 = engine.evaluate(req)

        # 1. Pure Determinism Check
        self.assertEqual(res1.model_dump(), res2.model_dump())

        # 2. Pipeline Results Verification
        self.assertTrue(res1.success)
        self.assertEqual(len(res1.all_ranked_products), 2)
        self.assertEqual(len(res1.rejected_products), 1)
        self.assertEqual(res1.rejected_products[0].product_id, "p3")

        # 3. Routine Assembly Verification
        self.assertGreater(len(res1.morning_routine.steps), 0)
        self.assertGreater(len(res1.evening_routine.steps), 0)
        self.assertIn("Cleanser", res1.morning_routine.missing_steps)


if __name__ == "__main__":
    unittest.main()
