from providers.base import AIProvider


class MockProvider(AIProvider):
    """Deterministic Mock AI Provider for testing and local development without LLM costs."""

    def generate_explanation(self, system_prompt: str, user_prompt: str) -> str:
        return (
            "Your personalized skincare routine has been designed based on your skin profile. "
            "In the morning, apply products in sequence from lightest to heaviest to hydrate and protect. "
            "In the evening, focus on barrier repair and targeted active treatments."
        )
