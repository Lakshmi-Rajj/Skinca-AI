import unittest
from models.request import RecommendationRequest, CandidateProduct, ProductIngredientItem
from contraindications.contraindication_checker import ContraindicationChecker


class TestContraindicationChecker(unittest.TestCase):
    def test_rejects_allergens_and_excluded_ingredients(self):
        req = RecommendationRequest(
            tenant_id="tenant-123",
            skin_type="SENSITIVE",
            allergies=["Salicylic Acid"],
            excluded_ingredients=["Fragrance"],
            candidate_products=[],
        )

        candidates = [
            CandidateProduct(
                id="p1",
                name="Safe Serum",
                category="SERUM",
                ingredients=[ProductIngredientItem(ingredient_id="i1", inci_name="Sodium Hyaluronate", display_name="Hyaluronic Acid")],
            ),
            CandidateProduct(
                id="p2",
                name="Allergen BHA Serum",
                category="SERUM",
                ingredients=[ProductIngredientItem(ingredient_id="i2", inci_name="Salicylic Acid", display_name="Salicylic Acid")],
            ),
            CandidateProduct(
                id="p3",
                name="Fragrant Cream",
                category="MOISTURIZER",
                ingredients=[ProductIngredientItem(ingredient_id="i3", inci_name="Fragrance", display_name="Fragrance")],
            ),
        ]

        safe, rejected = ContraindicationChecker.check_contraindications(req, candidates)

        self.assertEqual(len(safe), 1)
        self.assertEqual(safe[0].id, "p1")
        self.assertEqual(len(rejected), 2)
        self.assertIn("Salicylic Acid", rejected[0].rejection_reason)


if __name__ == "__main__":
    unittest.main()
