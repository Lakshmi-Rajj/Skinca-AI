from fastapi import FastAPI, HTTPException, status
from models.explanation_models import StructuredRecommendationInput, ExplanationOutput
from services.explanation_service import ExplanationService

app = FastAPI(
    title="AI Explanation Service",
    description="Natural language explanation microservice for deterministic recommendation results.",
    version="1.0.0",
)

service = ExplanationService()


@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    return {
        "status": "ok",
        "service": "ai-explanation-service",
        "version": "1.0.0",
    }


@app.post(
    "/explain",
    response_model=ExplanationOutput,
    status_code=status.HTTP_200_OK,
    summary="Generate natural language explanation from structured recommendation response",
)
def generate_explanation(input_data: StructuredRecommendationInput) -> ExplanationOutput:
    try:
        return service.generate_explanation(input_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Explanation generation failed: {str(e)}",
        )
