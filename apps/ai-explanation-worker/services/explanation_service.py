import hashlib
import json
from models.explanation_models import StructuredRecommendationInput, ExplanationOutput
from providers.provider_factory import ProviderFactory
from prompts.system_prompt import SYSTEM_PROMPT
from prompts.prompt_builder import PromptBuilder
from validators.response_validator import ResponseValidator
from cache.in_memory_cache import InMemoryCache
from config.ai_config import ai_config

cache = InMemoryCache()


class ExplanationService:
    """Orchestrates prompt building, cache lookup, LLM provider execution, output validation, and fallback."""

    def __init__(self, provider_name: str = None):
        self.provider_name = provider_name or ai_config.provider
        self.provider = ProviderFactory.get_provider(self.provider_name)

    def generate_explanation(self, input_data: StructuredRecommendationInput) -> ExplanationOutput:
        cache_key = self._generate_cache_key(input_data)

        # 1. Cache Lookup
        cached_text = cache.get(cache_key)
        if cached_text:
            return ExplanationOutput(
                explanation_text=cached_text,
                prompt_version=ai_config.prompt_version,
                cached=True,
                fallback_used=False,
                provider_used=self.provider_name,
            )

        # 2. Build Prompts
        user_prompt = PromptBuilder.build_user_prompt(input_data)

        # 3. Call AI Provider
        try:
            raw_explanation = self.provider.generate_explanation(SYSTEM_PROMPT, user_prompt)

            # 4. Validate Response
            if ResponseValidator.validate_explanation(raw_explanation, input_data):
                cache.set(cache_key, raw_explanation, ai_config.cache_ttl_seconds)
                return ExplanationOutput(
                    explanation_text=raw_explanation,
                    prompt_version=ai_config.prompt_version,
                    cached=False,
                    fallback_used=False,
                    provider_used=self.provider_name,
                )
            else:
                return self._build_fallback_explanation(input_data, reason="Validation failed")
        except Exception:
            return self._build_fallback_explanation(input_data, reason="Provider error")

    def _generate_cache_key(self, input_data: StructuredRecommendationInput) -> str:
        payload = {
            "tenant": input_data.tenant_id,
            "version": ai_config.prompt_version,
            "skin_type": input_data.skin_type,
            "morning_pids": [s.product_id for s in input_data.morning_routine.steps],
            "evening_pids": [s.product_id for s in input_data.evening_routine.steps],
        }
        encoded = json.dumps(payload, sort_keys=True).encode("utf-8")
        return f"exp_{hashlib.sha256(encoded).hexdigest()}"

    def _build_fallback_explanation(
        self, input_data: StructuredRecommendationInput, reason: str = ""
    ) -> ExplanationOutput:
        fallback_text = "\n".join(input_data.summary_bullets)
        if not fallback_text:
            fallback_text = (
                f"Personalized skincare routine for {input_data.skin_type} skin focusing on "
                f"[{', '.join(input_data.skin_concerns)}]."
            )

        return ExplanationOutput(
            explanation_text=f"{fallback_text}\n(Note: Generated via deterministic fallback summary)",
            prompt_version=ai_config.prompt_version,
            cached=False,
            fallback_used=True,
            provider_used="DETERMINISTIC_FALLBACK",
        )
