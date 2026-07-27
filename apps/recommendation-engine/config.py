import os

class Settings:
    PROJECT_NAME: str = "Recommendation Engine"
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    GRPC_PORT: int = int(os.getenv("GRPC_PORT", "50051"))

settings = Settings()
