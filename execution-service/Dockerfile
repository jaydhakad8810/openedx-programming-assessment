FROM python:3.12-slim-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-17-jdk-headless \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --uid 10001 runner

WORKDIR /workspace
RUN chown runner:runner /workspace

USER runner

CMD ["python3", "--version"]
