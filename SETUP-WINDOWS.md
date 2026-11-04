# CloudSaathi — Windows Setup and GitHub Actions Deployment

## 1. Prerequisites

Install and verify:

```powershell
git --version
aws --version
terraform -version
node --version
npm --version
python --version
```

Use Node.js 20+, Python 3.12+, Terraform 1.5+, and AWS CLI v2.

## 2. Configure project values

Copy the example file:

```powershell
Copy-Item terraform/terraform.tfvars.example terraform/terraform.tfvars
```

Edit `terraform/terraform.tfvars`:
- `artifact_bucket_name`: globally unique, lowercase S3 name.
- `github_repository`: exact `owner/repository` name.
- `model_id`: keep `apac.amazon.nova-micro-v1:0` if that inference profile is enabled for your account.

Do not commit `terraform.tfvars`.

## 3. AWS and Bedrock checks

For initial infrastructure provisioning, configure AWS CLI locally and verify the intended account:

```powershell
aws configure
aws sts get-caller-identity
```

In the AWS Console, select `ap-south-1` and verify that Amazon Nova Micro access is enabled.

## 4. Build and validate

From the project root:

```powershell
.\scripts\build_lambda.ps1
terraform -chdir=terraform init
terraform -chdir=terraform fmt -recursive
terraform -chdir=terraform validate
terraform -chdir=terraform plan
```

**Existing AWS deployment warning:** this project archive's current Terraform state file was empty while its backup state contained managed resources. Do not apply or destroy until you have reconciled the local state with the resources currently in AWS. Inspect:

```powershell
terraform -chdir=terraform state list
terraform -chdir=terraform show
terraform -chdir=terraform plan
```

Keep a secure copy of the previous state outside the Git repository. Import existing resources or restore the correct state as appropriate. Do not treat an empty state as proof that AWS is empty.

After the plan is reconciled and reviewed, provision/update infrastructure:

```powershell
terraform -chdir=terraform apply
```

## 5. Configure GitHub

Push the project to the repository whose exact `owner/name` is configured in `terraform.tfvars`.

In GitHub → Settings → Secrets and variables → Actions:

**Secret**
- `AWS_ROLE_ARN` = `terraform -chdir=terraform output -raw github_actions_role_arn`

**Variables**
- `AWS_REGION` = `ap-south-1`
- `PROJECT_NAME` = `cloudsaathi`
- `S3_BUCKET` = `terraform -chdir=terraform output -raw artifact_bucket`
- `LAMBDA_FUNCTION_NAME` = `cloudsaathi-chat`
- `VITE_API_URL` = `terraform -chdir=terraform output -raw chatbot_api_url`
- `EC2_INSTANCE_NAME` = `cloudsaathi-frontend` (optional; default Name tag)

The API URL is the base API Gateway URL. Do not add `/chat`.

The EC2 instance needs the Systems Manager agent and the `AmazonSSMManagedInstanceCore` instance role policy; Terraform configures both.

## 6. Push and deploy

```powershell
git add .
git commit -m "Automate CloudSaathi CI/CD with GitHub Actions"
git push origin main
```

The workflow will lint and build the frontend, validate Terraform, run security scans, package and update Lambda, upload the frontend ZIP to S3, then deploy it to the single EC2 instance through SSM.

Pull requests run validation and scans only. A push to `main` deploys. You can also run the workflow manually using **Actions → CloudSaathi CI-CD DevSecOps → Run workflow**.

## 7. Verify

Open the frontend URL:

```powershell
terraform -chdir=terraform output -raw frontend_url
```

Test the chatbot using the API Gateway endpoint:

```powershell
$api = (terraform -chdir=terraform output -raw chatbot_api_url).Trim()
$body = @{ message = "Explain AWS EC2 for a beginner" } | ConvertTo-Json
Invoke-RestMethod -Uri "$api/chat" -Method POST -ContentType "application/json" -Body $body
```

If the SSM deployment fails, check that the EC2 instance is running, has outbound internet access, has the SSM agent running, and appears as an online managed node in Systems Manager.

## 8. Remove infrastructure

Only after confirming the correct Terraform state:

```powershell
terraform -chdir=terraform plan -destroy
terraform -chdir=terraform destroy
```
