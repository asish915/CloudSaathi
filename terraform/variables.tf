variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "ap-south-1" # CHANGE: Change only if you intentionally use another region.
}

variable "project_name" {
  type    = string
  default = "helmora"
}

variable "artifact_bucket_name" {
  description = "Globally unique S3 bucket name"
  type        = string
  default     = "helmora-sasish-2026" # CHANGE: MUST be globally unique and lowercase.
}

variable "model_id" {
  description = "Amazon Bedrock model ID"
  type        = string
  default     = "apac.amazon.nova-lite-v1:0" # Image-capable model for chat attachments.
}

variable "cors_origin" {
  description = "Allowed browser origin"
  type        = string
  default     = "*" # CHANGE: After you know the EC2 URL, restrict this to http://YOUR_EC2_IP.
}

variable "ec2_instance_type" {
  type    = string
  default = "t3.micro" # CHANGE: Increase only if your workload requires it.
}

variable "ec2_ami_arch" {
  type    = string
  default = "x86_64"
}


variable "github_repository" {
  description = "GitHub repository in owner/name format"
  type        = string
  default     = "YOUR_GITHUB_USERNAME/YOUR_REPOSITORY" # CHANGE: Example: asish915/Helmora
}

variable "github_branch" {
  type    = string
  default = "main"
}

variable "context7_api_key" {
  description = "Context7 API key for documentation retrieval"
  type        = string
  sensitive   = true
}

