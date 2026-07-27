import urllib.request
import json
from providers.base import AIProvider
from config.ai_config import ai_config


class AnthropicProvider(AIProvider):
    """Anthropic Claude API Provider implementation using HTTP REST calls."""

    def generate_explanation(self, system_prompt: str, user_prompt: str) -> str:
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "x-api-key": ai_config.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }

        body = {
            "model": ai_config.model_name,
            "max_tokens": ai_config.max_tokens,
            "temperature": ai_config.temperature,
            "system": system_prompt,
            "messages": [
                {"role": "user", "content": user_prompt}
            ],
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(body).encode("utf-8"),
            headers=headers,
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=ai_config.timeout_seconds) as response:
            res_body = json.loads(response.read().decode("utf-8"))
            content_blocks = res_body.get("content", [])
            if content_blocks and "text" in content_blocks[0]:
                return content_blocks[0]["text"]
            raise ValueError("Invalid Anthropic API response structure")
