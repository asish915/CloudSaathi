$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$tf = Join-Path $root "terraform"

# CHANGE: Terraform must already be applied so this command can obtain the API URL.
$api = (terraform -chdir="$tf" output -raw chatbot_api_url).Trim()

Set-Location (Join-Path $root "frontend")

"VITE_API_URL=$api" | Set-Content .env

npm ci
npm run lint
npm run build

$zip = Join-Path (Get-Location) "dist.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path "dist\*" -DestinationPath $zip -Force

Write-Host "Frontend API: $api"
Write-Host "Created: $zip"
