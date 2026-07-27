from fastapi import FastAPI, HTTPException, status
from models.request import RecommendationRequest
from models.response import RecommendationResponse
from engine import RecommendationEngine

app = FastAPI(
    title="FastAPI Recommendation Engine",
    description="Pure deterministic B2B skincare recommendation engine microservice.",
    version="1.0.0",
)

engine = RecommendationEngine()


@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    return {
        "status": "ok",
        "service": "recommendation-engine",
        "version": "1.0.0",
        "engine_type": "DETERMINISTIC_RULE_ENGINE",
    }


@app.post(
    "/recommend",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate structured skin profile against candidate products",
)
def generate_recommendation(request: RecommendationRequest) -> RecommendationResponse:
    try:
        response = engine.evaluate(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Engine evaluation failed: {str(e)}",
        )
