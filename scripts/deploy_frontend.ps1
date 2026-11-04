$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$tf = Join-Path $root "terraform"
$region = (terraform -chdir="$tf" output -raw aws_region 2>$null).Trim()
if ([string]::IsNullOrWhiteSpace($region)) { $region = "ap-south-1" }

$bucket = (terraform -chdir="$tf" output -raw artifact_bucket).Trim()
$instanceId = (terraform -chdir="$tf" output -raw frontend_instance_id).Trim()

if ([string]::IsNullOrWhiteSpace($bucket)) { throw "Terraform output 'artifact_bucket' is empty." }
if ([string]::IsNullOrWhiteSpace($instanceId)) { throw "Terraform output 'frontend_instance_id' is empty." }

$zip = Join-Path $root "frontend\dist.zip"
if (!(Test-Path $zip)) {
    & (Join-Path $PSScriptRoot "build_frontend.ps1")
    if ($LASTEXITCODE -ne 0) { throw "Frontend build failed." }
}
if (!(Test-Path $zip)) { throw "frontend/dist.zip not found." }

aws s3 cp $zip "s3://$bucket/frontend/dist.zip" --region $region --sse AES256
if ($LASTEXITCODE -ne 0) { throw "S3 upload failed." }

$command = "set -e; aws s3 cp s3://$bucket/frontend/dist.zip /tmp/cloudsaathi-dist.zip --region $region; sudo mkdir -p /usr/share/nginx/html; sudo unzip -o /tmp/cloudsaathi-dist.zip -d /usr/share/nginx/html/; echo healthy | sudo tee /usr/share/nginx/html/health.html; sudo chown -R nginx:nginx /usr/share/nginx/html; sudo systemctl restart nginx; curl --fail --silent http://localhost/health.html"
$params = @{ commands = @($command) } | ConvertTo-Json -Compress

$result = aws ssm send-command `
    --instance-ids $instanceId `
    --document-name "AWS-RunShellScript" `
    --parameters $params `
    --region $region `
    --output json | ConvertFrom-Json

if ($LASTEXITCODE -ne 0) { throw "Could not send deployment command through SSM." }

$commandId = $result.Command.CommandId
aws ssm wait command-executed --command-id $commandId --instance-id $instanceId --region $region
if ($LASTEXITCODE -ne 0) {
    aws ssm get-command-invocation --command-id $commandId --instance-id $instanceId --region $region
    throw "Frontend deployment failed. Check the SSM command output."
}

Write-Host "CloudSaathi frontend deployed successfully."
Write-Host "Website: $(terraform -chdir="$tf" output -raw frontend_url)"
