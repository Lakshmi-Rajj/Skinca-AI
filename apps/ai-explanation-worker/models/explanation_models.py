from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RoutineStep(BaseModel):
    product_id: str
    name: str
    category: str
    matched_concerns: List[str] = Field(default_factory=list)
    matched_ingredients: List[str] = Field(default_factory=list)


class RoutineSummary(BaseModel):
    routine_type: str
    steps: List[RoutineStep] = Field(default_factory=list)
    missing_steps: List[str] = Field(default_factory=list)


class StructuredRecommendationInput(BaseModel):
    tenant_id: str
    skin_type: str
    skin_concerns: List[str] = Field(default_factory=list)
    morning_routine: RoutineSummary
    evening_routine: RoutineSummary
    summary_bullets: List[str] = Field(default_factory=list)


class ExplanationOutput(BaseModel):
    explanation_text: str
    prompt_version: str
    cached: bool = False
    fallback_used: bool = False
    provider_used: str = "MOCK"
