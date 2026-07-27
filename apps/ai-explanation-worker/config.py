import os

class WorkerSettings:
    SQS_QUEUE_URL: str = os.getenv("AWS_SQS_TELEMETRY_QUEUE_URL", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

worker_settings = WorkerSettings()
