import time
from typing import Optional, Dict, Tuple
from cache.cache_provider import CacheProvider


class InMemoryCache(CacheProvider):
    """In-memory cache implementation with TTL support."""

    def __init__(self):
        self._store: Dict[str, Tuple[str, float]] = {}

    def get(self, key: str) -> Optional[str]:
        if key not in self._store:
            return None

        value, expiry = self._store[key]
        if time.time() > expiry:
            del self._store[key]
            return None

        return value

    def set(self, key: str, value: str, ttl_seconds: int = 86400) -> None:
        expiry = time.time() + ttl_seconds
        self._store[key] = (value, expiry)
