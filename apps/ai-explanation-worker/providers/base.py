from abc import ABC, abstractmethod


class AIProvider(ABC):
    """Abstract Base Class for AI Explanation Providers."""

    @abstractmethod
    def generate_explanation(self, system_prompt: str, user_prompt: str) -> str:
        """Generate natural language explanation from system and user prompt strings."""
        pass
