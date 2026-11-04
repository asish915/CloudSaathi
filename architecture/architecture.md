# CloudSaathi — Single EC2 AWS Architecture

```text
User browser
    |
    v
Single EC2 (Amazon Linux 2023 + NGINX + React/Vite)
    |                                      ^
    |                                      | S3 frontend/dist.zip
    v                                      |
API Gateway HTTP API                 GitHub Actions
    |                                 |-- CI: lint/build/validate
    v                                 |-- security scans
Lambda Chat Backend                  |-- OIDC role assumption
    |                                 |-- update Lambda code
    v                                 |-- upload frontend to S3
Amazon Bedrock Nova Micro             |-- SSM deploy to EC2
    |
    v
Curated Markdown knowledge packaged with Lambda
```

## Infrastructure

- One public EC2 instance serves the static frontend through NGINX.
- The EC2 instance role can read the frontend artifact from the private S3 bucket and is registered with Systems Manager.
- API Gateway exposes `POST /chat` and invokes the Python Lambda.
- Lambda loads curated Markdown files from its deployment package and calls the configured Bedrock inference profile.
- GitHub Actions uses OIDC. No long-lived AWS access keys or EC2 SSH key are required.

This learning/demo deployment intentionally has no ALB, Auto Scaling Group, NAT Gateway, or Elastic IP. The EC2 public IPv4 address can change if the instance is replaced.
