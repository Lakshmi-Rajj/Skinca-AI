import unittest
from models.explanation_models import StructuredRecommendationInput, RoutineSummary
from validators.response_validator import ResponseValidator


class TestResponseValidator(unittest.TestCase):
    def test_valid_text(self):
        sample_input = StructuredRecommendationInput(
            tenant_id="tenant-123",
            skin_type="DRY",
            morning_routine=RoutineSummary(routine_type="MORNING"),
            evening_routine=RoutineSummary(routine_type="EVENING"),
        )

        valid_text = "This gentle routine hydrates and restores dry skin using hyaluronic acid and ceramides."
        self.assertTrue(ResponseValidator.validate_explanation(valid_text, sample_input))

    def test_invalid_medical_claims(self):
        sample_input = StructuredRecommendationInput(
            tenant_id="tenant-123",
            skin_type="DRY",
            morning_routine=RoutineSummary(routine_type="MORNING"),
            evening_routine=RoutineSummary(routine_type="EVENING"),
        )

        invalid_text = "This product acts as a prescription dermatological cure for severe medical conditions."
        self.assertFalse(ResponseValidator.validate_explanation(invalid_text, sample_input))


if __name__ == "__main__":
    unittest.main()
