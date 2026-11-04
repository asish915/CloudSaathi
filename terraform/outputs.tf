output "chatbot_api_url" {
  description = "CloudSaathi AI chatbot API endpoint"
  value       = aws_apigatewayv2_api.chat.api_endpoint
}

output "frontend_url" {
  description = "Public CloudSaathi website URL via EC2 instance"
  value       = "http://${aws_instance.frontend.public_ip}"
}

output "frontend_public_ip" {
  description = "Public IP address of the CloudSaathi frontend EC2 instance"
  value       = aws_instance.frontend.public_ip
}

output "frontend_instance_id" {
  description = "CloudSaathi frontend EC2 instance ID"
  value       = aws_instance.frontend.id
}

output "artifact_bucket" {
  description = "S3 bucket storing frontend deployment artifacts"
  value       = aws_s3_bucket.artifacts.bucket
}

output "github_actions_role_arn" {
  description = "IAM role ARN used by GitHub Actions"
  value       = aws_iam_role.github_actions.arn
}