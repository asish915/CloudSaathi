output "lambda_arn" {
  value = aws_lambda_function.chat.arn
}

output "function_name" {
  value = aws_lambda_function.chat.function_name
}

output "invoke_arn" {
  value = aws_lambda_function.chat.invoke_arn
}
