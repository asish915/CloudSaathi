import json
import os
import re
from pathlib import Path

import boto3  # type: ignore[import-not-found]

# CHANGE: Change this model ID if you intentionally use another Bedrock model.
MODEL_ID = os.environ.get("MODEL_ID", "apac.amazon.nova-micro-v1:0")
AWS_REGION = os.environ.get("AWS_REGION", "ap-south-1")

bedrock = boto3.client("bedrock-runtime", region_name=AWS_REGION)
KB_DIR = Path(__file__).parent / "knowledge"

SYSTEM_PROMPT = """
You are CloudSaathi, a patient and practical Cloud + DevOps mentor.

Teach cloud computing, AWS, DevOps, CI/CD, Docker, Kubernetes, Terraform,
DevSecOps and related engineering topics.

Rules:
- Start with a clear explanation.
- Use practical examples and AWS architectures when useful.
- Explain commands instead of only listing them.
- Do not invent AWS features, pricing, limits or current product details.
- For current pricing, quotas, or newly released features, advise the learner
  to verify current AWS documentation.
- If the curated context is insufficient, answer from general knowledge and
  say when verification is advisable.
- Prefer headings, bullets and concise examples.
"""

def load_documents():
    docs = []
    for path in sorted(KB_DIR.glob("*.md")):
        docs.append({"name": path.name, "text": path.read_text(encoding="utf-8")})
    return docs

DOCUMENTS = load_documents()

def keywords(text):
    return set(re.findall(r"[a-zA-Z0-9+#.-]{3,}", text.lower()))

def retrieve_context(question, limit=4):
    # CHANGE: Replace this function with Bedrock Knowledge Bases for a large RAG corpus.
    q = keywords(question)
    scored = []

    for doc in DOCUMENTS:
        score = len(q & keywords(doc["text"]))
        if score:
            scored.append((score, doc))

    scored.sort(key=lambda item: item[0], reverse=True)

    return "\n\n".join(
        f"### Source: {doc['name']}\n{doc['text']}"
        for _, doc in scored[:limit]
    )

def make_response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            # CHANGE: Set CORS_ORIGIN to your exact frontend URL after testing.
            "Access-Control-Allow-Origin": os.environ.get("CORS_ORIGIN", "*"),
            "Access-Control-Allow-Headers": "content-type",
            "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
        "body": json.dumps(body),
    }

def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method")

    if method == "OPTIONS":
        return make_response(204, {})

    try:
        raw_body = event.get("body") or "{}"

        if event.get("isBase64Encoded"):
            import base64
            raw_body = base64.b64decode(raw_body).decode("utf-8")

        payload = json.loads(raw_body)
        question = str(payload.get("message", "")).strip()

        if not question:
            return make_response(400, {"error": "message is required"})

        if len(question) > 4000:
            return make_response(
                413,
                {"error": "message is too long; maximum is 4000 characters"},
            )

        context_text = retrieve_context(question)

        prompt = f"""
Curated knowledge context:
{context_text or "No directly matching curated document was found."}

Learner question:
{question}

Answer as CloudSaathi. Give a useful mentor-style response.
"""

        result = bedrock.converse(
            modelId=MODEL_ID,
            system=[{"text": SYSTEM_PROMPT}],
            messages=[
                {
                    "role": "user",
                    "content": [{"text": prompt}],
                }
            ],
            inferenceConfig={
                "maxTokens": 1200,
                "temperature": 0.2,
            },
        )

        answer = result["output"]["message"]["content"][0]["text"]

        return make_response(
            200,
            {
                "answer": answer,
                "model": MODEL_ID,
            },
        )

    except Exception as exc:
        print(f"ERROR: {type(exc).__name__}: {exc}")
        return make_response(
            500,
            {"error": "The mentor could not process the request."},
        )
