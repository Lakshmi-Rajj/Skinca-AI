import re
from models.explanation_models import StructuredRecommendationInput


class ResponseValidator:
    """Validates LLM-generated explanations ensuring no medical claims or hallucinated instructions."""

    UNALLOWED_MEDICAL_TERMS = [
        "cure",
        "diagnose",
        "prescription",
        "dermatologist replacement",
        "medical therapy",
    ]

    @staticmethod
    def validate_explanation(
        explanation_text: str,
        input_data: StructuredRecommendationInput,
    ) -> bool:
        if not explanation_text or len(explanation_text.strip()) < 20:
            return False

        lower_text = explanation_text.lower()

        # Check for unallowed medical claims
        for term in ResponseValidator.UNALLOWED_MEDICAL_TERMS:
            if term in lower_text:
                return False

        return True
