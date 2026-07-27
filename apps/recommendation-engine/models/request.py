from typing import List, Optional
from pydantic import BaseModel, Field


class ProductIngredientItem(BaseModel):
    ingredient_id: str
    inci_name: str
    display_name: str
    functions: List[str] = Field(default_factory=list)
    skin_types: List[str] = Field(default_factory=list)
    skin_concerns: List[str] = Field(default_factory=list)
    irritation_risk: str = "LOW"
    is_primary_active: bool = False


class CandidateProduct(BaseModel):
    id: str
    name: str
    category: str
    product_type: Optional[str] = None
    status: str = "ACTIVE"
    price: float = 0.0
    compatible_skin_types: List[str] = Field(default_factory=list)
    target_skin_concerns: List[str] = Field(default_factory=list)
    ingredients: List[ProductIngredientItem] = Field(default_factory=list)


class TenantRuleConfig(BaseModel):
    weight_compatibility: float = 40.0
    weight_concern_coverage: float = 25.0
    weight_safety: float = 20.0
    weight_ingredient_quality: float = 15.0
    max_morning_products: int = 4
    max_evening_products: int = 5


class RecommendationRequest(BaseModel):
    tenant_id: str
    user_id: Optional[str] = None
    skin_type: str  # DRY, OILY, COMBINATION, SENSITIVE, NORMAL
    skin_concerns: List[str] = Field(default_factory=list)  # ACNE, HYPERPIGMENTATION, REDNESS, etc.
    sensitivity_level: str = "LOW"  # LOW, MEDIUM, HIGH
    allergies: List[str] = Field(default_factory=list)
    preferred_product_types: List[str] = Field(default_factory=list)
    excluded_ingredients: List[str] = Field(default_factory=list)
    max_budget: Optional[float] = None
    candidate_products: List[CandidateProduct] = Field(default_factory=list)
    tenant_config: TenantRuleConfig = Field(default_factory=TenantRuleConfig)
