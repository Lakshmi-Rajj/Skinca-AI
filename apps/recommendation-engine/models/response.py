from typing import List, Optional
from pydantic import BaseModel, Field


class ScoreBreakdown(BaseModel):
    compatibility_score: float
    concern_coverage_score: float
    safety_score: float
    ingredient_quality_score: float


class RecommendedProduct(BaseModel):
    product_id: str
    name: str
    category: str
    price: float
    total_score: float
    score_breakdown: ScoreBreakdown
    matched_concerns: List[str] = Field(default_factory=list)
    matched_ingredients: List[str] = Field(default_factory=list)


class RejectedProduct(BaseModel):
    product_id: str
    name: str
    rejection_reason: str
    conflicting_ingredient: Optional[str] = None


class Routine(BaseModel):
    routine_type: str  # MORNING, EVENING
    steps: List[RecommendedProduct] = Field(default_factory=list)
    missing_steps: List[str] = Field(default_factory=list)
    total_cost: float = 0.0


class Explanation(BaseModel):
    summary_bullets: List[str] = Field(default_factory=list)
    total_candidates_evaluated: int = 0
    total_eligible_products: int = 0
    total_rejected_products: int = 0


class RecommendationResponse(BaseModel):
    success: bool = True
    morning_routine: Routine
    evening_routine: Routine
    all_ranked_products: List[RecommendedProduct] = Field(default_factory=list)
    rejected_products: List[RejectedProduct] = Field(default_factory=list)
    explanation: Explanation
