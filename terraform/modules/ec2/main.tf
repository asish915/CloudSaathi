resource "aws_security_group" "frontend" {
  name        = "${var.project_name}-frontend-sg"
  description = "Allow HTTP access directly to the Helmora frontend EC2"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.project_name}-frontend-sg"
    Project = var.project_name
  }
}

resource "aws_iam_role" "ec2" {
  name = "${var.project_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy" "ec2_s3" {
  name = "${var.project_name}-ec2-s3"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject"]
      Resource = "${var.artifact_bucket_arn}/frontend/*"
    }]
  })
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2.name
}

data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-${var.ec2_ami_arch}"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

resource "aws_instance" "frontend" {
  ami                         = data.aws_ami.al2023.id
  instance_type               = var.ec2_instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [aws_security_group.frontend.id]
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  associate_public_ip_address = true

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail

    dnf install -y nginx unzip awscli amazon-ssm-agent
    mkdir -p /usr/share/nginx/html

    if aws s3 cp "s3://${var.artifact_bucket_name}/frontend/dist.zip" /tmp/helmora-dist.zip --region ${var.aws_region}; then
      unzip -o /tmp/helmora-dist.zip -d /usr/share/nginx/html/
    else
      echo "Helmora is deploying. Please upload the frontend build." > /usr/share/nginx/html/index.html
    fi

    echo "healthy" > /usr/share/nginx/html/health.html
    chown -R nginx:nginx /usr/share/nginx/html
    systemctl enable nginx
    systemctl restart nginx
    systemctl enable --now amazon-ssm-agent
  EOF

  tags = {
    Name    = "${var.project_name}-frontend"
    Project = var.project_name
  }

  depends_on = [
    aws_iam_role_policy.ec2_s3,
    aws_iam_role_policy_attachment.ec2_ssm
  ]
}
