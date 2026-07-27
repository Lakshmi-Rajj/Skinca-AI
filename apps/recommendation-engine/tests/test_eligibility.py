import unittest
from models.request import RecommendationRequest, CandidateProduct
from eligibility.eligibility_filter import EligibilityFilter


class TestEligibilityFilter(unittest.TestCase):
    def test_filter_active_and_compatible_products(self):
        req = RecommendationRequest(
            tenant_id="tenant-123",
            skin_type="DRY",
            candidate_products=[
                CandidateProduct(id="p1", name="Hydrating Serum", category="SERUM", status="ACTIVE", compatible_skin_types=["DRY", "NORMAL"]),
                CandidateProduct(id="p2", name="Draft Toner", category="TONER", status="DRAFT", compatible_skin_types=["DRY"]),
                CandidateProduct(id="p3", name="Mattifying Gel", category="MOISTURIZER", status="ACTIVE", compatible_skin_types=["OILY"]),
            ],
        )

        eligible, rejected = EligibilityFilter.filter_eligible_products(req)

        self.assertEqual(len(eligible), 1)
        self.assertEqual(eligible[0].id, "p1")
        self.assertEqual(len(rejected), 2)


if __name__ == "__main__":
    unittest.main()
