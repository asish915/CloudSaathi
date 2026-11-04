# DevOps Technologies and Tools

A DevOps toolchain is assembled around a team's workflow; no single project needs every tool in this catalogue.

## Source control and collaboration
- Git, GitHub, GitLab, Bitbucket, Azure Repos.

## CI/CD and release automation
- Jenkins, GitHub Actions, GitLab CI/CD, CircleCI, Azure Pipelines, TeamCity, Bamboo, AWS CodePipeline, AWS CodeBuild, AWS CodeDeploy.
- Argo CD and Flux CD implement GitOps-style continuous delivery for Kubernetes.
- Typical pipeline: checkout -> lint/unit tests -> security checks -> build/package -> publish artifact/image -> deploy -> smoke tests -> notify/rollback.

## Infrastructure as code and configuration
- Terraform and OpenTofu; AWS CloudFormation and AWS CDK; Pulumi; Terragrunt.
- Ansible, Puppet, Chef, and SaltStack automate configuration and system management.
- Packer builds machine images; Vagrant provides reproducible local development environments.

## Containers and orchestration
- Docker and Podman build and run containers; containerd is a container runtime.
- Kubernetes orchestrates container workloads; Helm packages Kubernetes applications; Kustomize customizes manifests.
- Amazon ECS/EKS and AWS Fargate are managed AWS options.

## Observability and reliability
- Prometheus and Grafana for metrics and dashboards; OpenTelemetry for instrumentation; Jaeger for traces; Loki and ELK/OpenSearch for logs.
- Datadog, New Relic, and Dynatrace are commercial observability platforms; Amazon CloudWatch is the AWS-native option.
- SRE practices include SLIs/SLOs, error budgets, incident response, postmortems, capacity planning, and rollback strategy.

## Web serving, networking, and secrets
- NGINX and HAProxy for web serving/reverse proxy/load balancing; Consul for service networking/discovery; HashiCorp Vault and AWS Secrets Manager for secrets.
- Use managed identity and secret stores; never commit credentials or private keys to source control.

## Common deployment strategies
- Rolling: replace instances/pods incrementally.
- Blue/green: switch traffic between two environments after validation.
- Canary: send a small share of traffic to a new version before increasing rollout.
- Infrastructure changes should be reviewed with a plan, applied with least privilege, observed, and rolled back safely when needed.
