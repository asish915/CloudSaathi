# Orinex backend improvement notes

This update replaces `backend/lambda/handler.py` while keeping the existing Lambda + Bedrock Converse API shape and the curated `knowledge/*.md` files.


## Compatibility

Existing frontend requests that send `{ "message": "..." }` continue to work.

Optional conversational context is now accepted as either `history` or `messages`, with entries shaped like:

```json
{
  "message": "Why do we need worker nodes?",
  "history": [
    { "role": "user", "content": "What is a Kubernetes control plane?" },
    { "role": "assistant", "content": "The control plane manages ..." }
  ]
}
```

Only the last eight user/assistant turns are accepted; each is capped to 3,000 characters.

## Environment variables

- `MODEL_ID` (existing; default remains `apac.amazon.nova-micro-v1:0`)
- `AWS_REGION` (existing; default remains `ap-south-1`)
- `CORS_ORIGIN` (existing)
- `MAX_TOKENS` (optional; default `2400`)
- `TEMPERATURE` (optional; default `0.3`)

## Changes

- Adaptive response guidance for concepts, comparisons, tutorials, debugging, code requests, and interview preparation.
- Stronger accuracy and least-privilege guardrails.
- Knowledge documents are split by headings before scoring, instead of treating entire files as one retrieval unit.
- Improved retrieval scoring and bounded context size.
- Optional conversation history support while retaining compatibility with message-only clients.
- Handles empty output and Bedrock safety-filter stop reasons without assuming a text block exists.
- Better client-facing transient error response; details are logged server-side.
- Increased output token ceiling to 2,400 by default (override through environment variable).

## Important

This is a backend-side first pass. Frontend must send prior conversation turns in `history`/`messages` for follow-up context to work. This file does not alter Terraform, IAM, API Gateway, or frontend code.
