$ErrorActionPreference = "Stop"

# CHANGE: Normally no changes are required here.
# Packages handler.py and the curated knowledge files for AWS Lambda.

$root = Split-Path -Parent $PSScriptRoot
$build = Join-Path $root "build"
$source = Join-Path $root "backend\lambda"
$zip = Join-Path $build "lambda.zip"

if (Test-Path $build) { Remove-Item $build -Recurse -Force }
New-Item -ItemType Directory -Path $build | Out-Null

Compress-Archive -Path (Join-Path $source "*") -DestinationPath $zip -Force
Write-Host "Created: $zip"
