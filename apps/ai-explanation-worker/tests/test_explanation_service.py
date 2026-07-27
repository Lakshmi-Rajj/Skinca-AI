import unittest
from models.explanation_models import StructuredRecommendationInput, RoutineSummary, RoutineStep
from services.explanation_service import ExplanationService


class TestExplanationService(unittest.TestCase):
    def test_service_with_mock_provider(self):
        service = ExplanationService(provider_name="MOCK")

        input_data = StructuredRecommendationInput(
            tenant_id="tenant-123",
            skin_type="DRY",
            skin_concerns=["DEHYDRATION"],
            summary_bullets=["Evaluated DRY skin for DEHYDRATION"],
            morning_routine=RoutineSummary(
                routine_type="MORNING",
                steps=[
                    RoutineStep(
                        product_id="p1",
                        name="HA Hydrating Serum",
                        category="SERUM",
                        matched_ingredients=["Hyaluronic Acid"],
                    )
                ],
            ),
            evening_routine=RoutineSummary(routine_type="EVENING"),
        )

        res1 = service.generate_explanation(input_data)
        self.assertFalse(res1.cached)
        self.assertFalse(res1.fallback_used)
        self.assertIn("recommendation_prompt_v1", res1.prompt_version)

        # Second call should return cached response
        res2 = service.generate_explanation(input_data)
        self.assertTrue(res2.cached)
        self.assertEqual(res1.explanation_text, res2.explanation_text)


if __name__ == "__main__":
    unittest.main()
