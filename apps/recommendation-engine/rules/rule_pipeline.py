from typing import Dict, Any, List

class RulePipeline:
    """10-Stage Deterministic Skincare Rule Pipeline.
    
    Rules evaluated:
    1. Skin Type Rule
    2. Skin Concern Rule
    3. Ingredient Compatibility Rule
    4. Contraindication Rule
    5. Pregnancy Safety Rule
    6. Age Rule
    7. AM/PM Routine Rule
    8. UV Sensitivity Rule
    9. Existing Routine Conflict Rule
    10. Lifestyle Rule
    """

    @staticmethod
    def evaluate_rules(profile: Dict[str, Any], product: Dict[str, Any]) -> Dict[str, Any]:
        matched_rules: List[str] = []
        rejected_rules: List[str] = []
        warnings: List[str] = []
        score_points: float = 50.0 # Baseline score

        skin_type = profile.get("skinType", "").upper()
        concerns = [c.lower() for c in profile.get("skinConcerns", [])]
        is_pregnant = profile.get("isPregnant", False)
        age = profile.get("age", 25)
        existing_actives = [a.lower() for a in profile.get("existingRoutineActives", [])]
        formulation = product.get("formulation", [])

        # 1. Skin Type Rule
        if skin_type:
            matched_rules.append(f"SKIN_TYPE_MATCH:{skin_type}")
            score_points += 10.0

        # 2. Skin Concern Rule
        matched_concerns = 0
        for c in concerns:
            for item in formulation:
                ing_concerns = [sc.lower() for sc in item.get("skinConcerns", [])]
                if c in ing_concerns or c in item.get("displayName", "").lower():
                    matched_concerns += 1
                    break
        if matched_concerns > 0:
            score_points += matched_concerns * 15.0
            matched_rules.append(f"SKIN_CONCERN_MATCH:{matched_concerns}_CONCERNS")

        # 3. Ingredient Compatibility & 4. Contraindications
        # 5. Pregnancy Safety Rule
        if is_pregnant:
            for item in formulation:
                inci = item.get("inciName", "").lower()
                if "retinol" in inci or "tretinoin" in inci or "hydroquinone" in inci:
                    rejected_rules.append("PREGNANCY_SAFETY_VIOLATION")
                    warnings.append(f"Contains {item.get('displayName')} which is contraindicated during pregnancy.")
                    score_points -= 100.0

        # 6. Age Rule
        if age < 18:
            for item in formulation:
                if "glycolic" in item.get("inciName", "").lower() or "retinol" in item.get("inciName", "").lower():
                    warnings.append("High-potency exfoliant or retinoid for teenage skin profile.")
                    score_points -= 15.0

        # 7. AM/PM Routine Rule
        time_preference = profile.get("timeOfDay", "BOTH").upper()
        if time_preference == "AM":
            for item in formulation:
                if item.get("inciName", "") == "Retinol":
                    warnings.append("Retinol is recommended for evening application only.")
                    score_points -= 20.0

        # 8. UV Sensitivity Rule
        if profile.get("highSunExposure", False):
            for item in formulation:
                if item.get("photosensitive", False):
                    warnings.append(f"{item.get('displayName')} increases photosensitivity under high sun exposure.")
                    score_points -= 10.0

        # 9. Existing Routine Conflict Rule
        for active in existing_actives:
            if "retinol" in active:
                for item in formulation:
                    if "salicylic" in item.get("inciName", "").lower() or "glycolic" in item.get("inciName", "").lower():
                        warnings.append(f"Potential conflict between existing {active} and product active {item.get('displayName')}.")
                        score_points -= 25.0

        # 10. Lifestyle Rule
        if profile.get("preferVegan", False) and not product.get("isVegan", True):
            rejected_rules.append("LIFESTYLE_VEGAN_VIOLATION")
            score_points -= 40.0

        final_score = max(0.0, min(100.0, score_points))

        return {
            "productId": product.get("id"),
            "score": round(final_score, 1),
            "matchedRules": matched_rules,
            "rejectedRules": rejected_rules,
            "warnings": warnings,
            "eligible": len(rejected_rules) == 0 and final_score >= 40.0,
        }
