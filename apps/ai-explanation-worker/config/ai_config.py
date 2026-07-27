import os
from pydantic import BaseModel


class AIConfig(BaseModel):
    provider: str = os.getenv("AI_PROVIDER", "MOCK")  # MOCK, ANTHROPIC
    model_name: str = os.getenv("AI_MODEL_NAME", "claude-3-5-sonnet-20241022")
    temperature: float = float(os.getenv("AI_TEMPERATURE", "0.2"))
    max_tokens: int = int(os.getenv("AI_MAX_TOKENS", "1024"))
    timeout_seconds: float = float(os.getenv("AI_TIMEOUT_SECONDS", "10.0"))
    retry_count: int = int(os.getenv("AI_RETRY_COUNT", "2"))
    prompt_version: str = os.getenv("AI_PROMPT_VERSION", "recommendation_prompt_v1")
    cache_ttl_seconds: int = int(os.getenv("AI_CACHE_TTL_SECONDS", "86400"))
    api_key: str = os.getenv("ANTHROPIC_API_KEY", "dummy_key")


ai_config = AIConfig()
