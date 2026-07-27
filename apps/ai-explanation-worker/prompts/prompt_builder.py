from models.explanation_models import StructuredRecommendationInput
from prompts.recommendation_prompt import RECOMMENDATION_PROMPT_V1
from config.ai_config import ai_config


class PromptBuilder:
    """Builds versioned user prompts from structured recommendation inputs."""

    @staticmethod
    def build_user_prompt(input_data: StructuredRecommendationInput) -> str:
        morning_lines = [
            f"- Step {idx+1}: {step.name} ({step.category}) [Key Actives: {', '.join(step.matched_ingredients)}]"
            for idx, step in enumerate(input_data.morning_routine.steps)
        ]
        morning_text = "\n".join(morning_lines) if morning_lines else "- No morning products selected."

        evening_lines = [
            f"- Step {idx+1}: {step.name} ({step.category}) [Key Actives: {', '.join(step.matched_ingredients)}]"
            for idx, step in enumerate(input_data.evening_routine.steps)
        ]
        evening_text = "\n".join(evening_lines) if evening_lines else "- No evening products selected."

        highlights_text = "\n".join([f"- {bullet}" for bullet in input_data.summary_bullets])

        return RECOMMENDATION_PROMPT_V1.format(
            skin_type=input_data.skin_type,
            skin_concerns=", ".join(input_data.skin_concerns),
            morning_steps=morning_text,
            evening_steps=evening_text,
            highlights=highlights_text,
        )
