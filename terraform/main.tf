locals {
  lambda_zip = "${path.module}/../build/lambda.zip"
}

module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
}

module "s3" {
  source = "./modules/s3"

  project_name         = var.project_name
  artifact_bucket_name = var.artifact_bucket_name
}

module "ec2" {
  source = "./modules/ec2"

  project_name         = var.project_name
  aws_region           = var.aws_region
  ec2_instance_type    = var.ec2_instance_type
  ec2_ami_arch         = var.ec2_ami_arch
  artifact_bucket_arn  = module.s3.bucket_arn
  artifact_bucket_name = module.s3.bucket_name
  subnet_id            = module.vpc.public_subnet_ids[0]
  vpc_id               = module.vpc.vpc_id
}

module "lambda" {
  source = "./modules/lambda"

  project_name    = var.project_name
  aws_region      = var.aws_region
  model_id        = var.model_id
  cors_origin     = var.cors_origin
  lambda_zip_path = local.lambda_zip
}

module "api_gateway" {
  source = "./modules/api_gateway"

  project_name         = var.project_name
  cors_origin          = var.cors_origin
  lambda_function_name = module.lambda.function_name
  lambda_invoke_arn    = module.lambda.invoke_arn
}

module "iam_github_actions" {
  source = "./modules/iam_github_actions"

  project_name        = var.project_name
  aws_region          = var.aws_region
  github_repository   = var.github_repository
  github_branch       = var.github_branch
  artifact_bucket_arn = module.s3.bucket_arn
  lambda_arn          = module.lambda.lambda_arn
}

moved {
  from = aws_vpc.main
  to   = module.vpc.aws_vpc.main
}

moved {
  from = aws_internet_gateway.main
  to   = module.vpc.aws_internet_gateway.main
}

moved {
  from = aws_subnet.public[0]
  to   = module.vpc.aws_subnet.public[0]
}

moved {
  from = aws_subnet.public[1]
  to   = module.vpc.aws_subnet.public[1]
}

moved {
  from = aws_route_table.public
  to   = module.vpc.aws_route_table.public
}

moved {
  from = aws_route_table_association.public[0]
  to   = module.vpc.aws_route_table_association.public[0]
}

moved {
  from = aws_route_table_association.public[1]
  to   = module.vpc.aws_route_table_association.public[1]
}

moved {
  from = aws_s3_bucket.artifacts
  to   = module.s3.aws_s3_bucket.artifacts
}

moved {
  from = aws_s3_bucket_public_access_block.artifacts
  to   = module.s3.aws_s3_bucket_public_access_block.artifacts
}

moved {
  from = aws_s3_bucket_versioning.artifacts
  to   = module.s3.aws_s3_bucket_versioning.artifacts
}

moved {
  from = aws_s3_bucket_server_side_encryption_configuration.artifacts
  to   = module.s3.aws_s3_bucket_server_side_encryption_configuration.artifacts
}

moved {
  from = aws_security_group.frontend
  to   = module.ec2.aws_security_group.frontend
}

moved {
  from = aws_iam_role.ec2
  to   = module.ec2.aws_iam_role.ec2
}

moved {
  from = aws_iam_role_policy_attachment.ec2_ssm
  to   = module.ec2.aws_iam_role_policy_attachment.ec2_ssm
}

moved {
  from = aws_iam_role_policy.ec2_s3
  to   = module.ec2.aws_iam_role_policy.ec2_s3
}

moved {
  from = aws_iam_instance_profile.ec2
  to   = module.ec2.aws_iam_instance_profile.ec2
}

moved {
  from = aws_instance.frontend
  to   = module.ec2.aws_instance.frontend
}

moved {
  from = aws_iam_role.lambda
  to   = module.lambda.aws_iam_role.lambda
}

moved {
  from = aws_iam_role_policy.lambda
  to   = module.lambda.aws_iam_role_policy.lambda
}

moved {
  from = aws_lambda_function.chat
  to   = module.lambda.aws_lambda_function.chat
}

moved {
  from = aws_cloudwatch_log_group.lambda
  to   = module.lambda.aws_cloudwatch_log_group.lambda
}

moved {
  from = aws_apigatewayv2_api.chat
  to   = module.api_gateway.aws_apigatewayv2_api.chat
}

moved {
  from = aws_apigatewayv2_integration.chat
  to   = module.api_gateway.aws_apigatewayv2_integration.chat
}

moved {
  from = aws_apigatewayv2_route.chat
  to   = module.api_gateway.aws_apigatewayv2_route.chat
}

moved {
  from = aws_apigatewayv2_stage.default
  to   = module.api_gateway.aws_apigatewayv2_stage.default
}

moved {
  from = aws_lambda_permission.api
  to   = module.api_gateway.aws_lambda_permission.api
}

moved {
  from = aws_iam_openid_connect_provider.github
  to   = module.iam_github_actions.aws_iam_openid_connect_provider.github
}

moved {
  from = aws_iam_role.github_actions
  to   = module.iam_github_actions.aws_iam_role.github_actions
}

moved {
  from = aws_iam_role_policy.github_actions
  to   = module.iam_github_actions.aws_iam_role_policy.github_actions
}
