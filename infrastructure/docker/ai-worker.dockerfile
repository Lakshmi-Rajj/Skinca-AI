# Production Dockerfile for Python AI Explanation Worker

FROM python:3.11-slim AS runner

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY apps/ai-explanation-worker/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/ai-explanation-worker/ ./

CMD ["python", "main.py"]
