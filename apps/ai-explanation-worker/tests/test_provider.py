import unittest
from providers.provider_factory import ProviderFactory
from providers.mock_provider import MockProvider


class TestProviderAbstraction(unittest.TestCase):
    def test_factory_returns_mock_provider(self):
        provider = ProviderFactory.get_provider("MOCK")
        self.assertIsInstance(provider, MockProvider)

    def test_mock_provider_output(self):
        provider = MockProvider()
        result = provider.generate_explanation("system", "user")
        self.assertIn("personalized skincare routine", result)


if __name__ == "__main__":
    unittest.main()
