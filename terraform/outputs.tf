output "chatbot_api_url" {
  description = "Helmora AI chatbot API endpoint"
  value       = module.api_gateway.api_url
}

output "frontend_url" {
  description = "Public Helmora website URL via EC2 instance"
  value       = "http://${module.ec2.public_ip}"
}

output "frontend_public_ip" {
  description = "Public IP address of the Helmora frontend EC2 instance"
  value       = module.ec2.public_ip
}

output "frontend_instance_id" {
  description = "Helmora frontend EC2 instance ID"
  value       = module.ec2.instance_id
}

output "artifact_bucket" {
  description = "S3 bucket storing frontend deployment artifacts"
  value       = module.s3.bucket_name
}

output "github_actions_role_arn" {
  description = "IAM role ARN used by GitHub Actions"
  value       = module.iam_github_actions.role_arn
}