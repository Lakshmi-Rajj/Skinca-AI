from providers.base import AIProvider
from providers.mock_provider import MockProvider
from providers.anthropic_provider import AnthropicProvider
from config.ai_config import ai_config


class ProviderFactory:
    """Factory creating AIProvider instances dynamically based on configuration."""

    @staticmethod
    def get_provider(provider_name: str = None) -> AIProvider:
        name = (provider_name or ai_config.provider).upper()

        if name == "ANTHROPIC":
            return AnthropicProvider()
        else:
            return MockProvider()
