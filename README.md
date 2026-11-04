# CloudSaathi — AI Mentor for Cloud & DevOps

CloudSaathi is a React/Vite frontend with an AWS Lambda chatbot backend. The Lambda retrieves relevant context from curated Markdown files packaged with the function and calls Amazon Bedrock Converse.

## Current deployment architecture

```text
Browser
  |
  v
Single EC2 (Amazon Linux 2023 + NGINX + React/Vite static files)
  |                         ^
  |                         | S3 frontend artifact
  v                         |
API Gateway HTTP API        GitHub Actions
  |                         |-- lint / build / security checks
  v                         |-- package and update Lambda
Lambda + packaged KB        |-- upload frontend ZIP to S3
  |                         |-- deploy to EC2 through AWS Systems Manager
  v
Amazon Bedrock Nova Micro

GitHub Actions authenticates to AWS with OIDC. No AWS access keys or EC2 SSH private key are needed.
```

This configuration intentionally uses **one EC2 instance**. It does not create an ALB, Auto Scaling Group, NAT Gateway, or Elastic IP.

## Repository layout

- `frontend/` — React/Vite application and ESLint configuration.
- `backend/lambda/` — Lambda handler and curated Markdown knowledge.
- `terraform/` — VPC, S3, EC2, IAM, Lambda, API Gateway, Bedrock permissions and GitHub OIDC role.
- `.github/workflows/main.yml` — CI checks and application deployment.
- `scripts/` — Windows PowerShell build and manual deployment helpers.
- `architecture/` — architecture documentation.

## First-time setup

1. Install Git, Terraform, AWS CLI, Node.js 20+, Python 3.12 and PowerShell.
2. Copy `terraform/terraform.tfvars.example` to `terraform/terraform.tfvars`.
3. Set a globally unique, lowercase S3 bucket name and your exact GitHub repository (`owner/repo`).
4. Verify Amazon Nova Micro access in Amazon Bedrock in `ap-south-1`.
5. Build the Lambda ZIP and validate Terraform:

   ```powershell
   .\scripts\build_lambda.ps1
   terraform -chdir=terraform init
   terraform -chdir=terraform fmt -recursive
   terraform -chdir=terraform validate
   terraform -chdir=terraform plan
   ```

6. Review the plan carefully before applying it:

   ```powershell
   terraform -chdir=terraform apply
   ```

   **Important for an existing deployment:** do not run `apply` or `destroy` against an empty/new state if AWS resources already exist. First inspect `terraform state list`, `terraform show`, and `terraform plan`; reconcile/import existing resources or restore the correct state. Keep a secure backup of the previous state outside Git.

7. Read Terraform outputs:

   ```powershell
   terraform -chdir=terraform output
   ```

8. Configure GitHub repository settings as described below, then push to `main`.

## GitHub Actions configuration

Create one GitHub **Secret**:

| Secret | Value |
|---|---|
| `AWS_ROLE_ARN` | Terraform output `github_actions_role_arn` |

Create these GitHub **Variables** (Settings → Secrets and variables → Actions → Variables):

| Variable | Value |
|---|---|
| `AWS_REGION` | `ap-south-1` |
| `PROJECT_NAME` | `cloudsaathi` |
| `S3_BUCKET` | Terraform output `artifact_bucket` |
| `LAMBDA_FUNCTION_NAME` | `cloudsaathi-chat` |
| `VITE_API_URL` | Terraform output `chatbot_api_url` (base URL only; do not append `/chat`) |
| `EC2_INSTANCE_NAME` | `cloudsaathi-frontend` (optional; this is the EC2 Name tag) |

The GitHub repository owner/name in `terraform/terraform.tfvars` must exactly match the repository receiving the workflow. The OIDC trust is restricted to pushes from the configured branch.

## What happens on GitHub

- Pull requests: package checks, Terraform formatting/validation, frontend lint/build, and security scans. No AWS deployment.
- Push to `main`: the same checks run, then GitHub Actions assumes the AWS role using OIDC, uploads the frontend artifact to S3, updates the Lambda code, and deploys the frontend to the tagged EC2 instance through Systems Manager.
- `workflow_dispatch`: allows a manual workflow run from GitHub Actions.

Infrastructure creation and changes remain a deliberate Terraform operation. The workflow deploys application code; it does not run a broad `terraform apply` with elevated CI permissions.

## Local development and deployment

```powershell
cd frontend
npm ci
npm run dev
```

Build and deploy manually after Terraform is configured:

```powershell
cd ..
.\scripts\build_lambda.ps1
.\scripts\build_frontend.ps1
.\scripts\deploy_frontend.ps1
```

The EC2 instance must be online and registered with Systems Manager. Its instance role includes `AmazonSSMManagedInstanceCore`.

## Important notes

- The frontend API URL is public configuration, not a secret. Keep it in a GitHub Variable, not a secret.
- Do not commit `.env`, `terraform.tfvars`, `.terraform/`, `*.tfstate`, `node_modules/`, `dist/`, or ZIP build outputs.
- Commit `terraform/.terraform.lock.hcl` so CI and local runs use consistent provider versions.
- The Lambda knowledge base is packaged inside the Lambda ZIP. The S3 `knowledge/` upload was removed because the handler does not read knowledge from S3.
- The Lambda uses the configured Bedrock inference profile ID (`apac.amazon.nova-micro-v1:0`). Ensure that profile is enabled for the AWS account and region.
- The EC2 public IP can change if the instance is replaced because no Elastic IP is provisioned. Update `VITE_API_URL` only if the API endpoint changes; restrict CORS to a stable frontend origin if you later add a domain.

## Cleanup

To remove AWS resources, review the Terraform state and plan first, then run:

```powershell
terraform -chdir=terraform plan -destroy
terraform -chdir=terraform destroy
```

Never destroy resources based on an unverified or empty state file.
