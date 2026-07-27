from abc import ABC, abstractmethod
from typing import Optional


class CacheProvider(ABC):
    """Abstract Base Class for Cache Provider Interface."""

    @abstractmethod
    def get(self, key: str) -> Optional[str]:
        pass

    @abstractmethod
    def set(self, key: str, value: str, ttl_seconds: int = 86400) -> None:
        pass
