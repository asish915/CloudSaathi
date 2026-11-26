variable "project_name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "model_id" {
  type = string
}

variable "cors_origin" {
  type = string
}

variable "lambda_zip_path" {
  type = string
}
variable "context7_api_key" {
  description = "Context7 API key for documentation retrieval"
  type        = string
  sensitive   = true
}
