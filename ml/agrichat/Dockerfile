# Étape 1: builder
FROM python:3.12-slim AS builder
WORKDIR /build

COPY ml/agrichat/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ml/agrichat/data/ /build/data/
COPY ml/agrichat/src/ /build/src/
ENV HF_HOME=/app/models
RUN --mount=type=secret,id=groq_api_key,target=/run/secrets/groq_api_key --mount=type=secret,id=hf_api_key,target=/run/secrets/hf_api_key python3 -m src.vectorstore

# Étape 2: app
FROM python:3.12-slim
WORKDIR /app

# Copie les paquets installés depuis le builder
COPY --from=builder /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=builder /usr/local/bin /usr/local/bin

COPY ml/agrichat/src ./src
COPY --from=builder /build/data/chroma_langchain_db /app/data/chroma_langchain_db

EXPOSE 8000
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]
