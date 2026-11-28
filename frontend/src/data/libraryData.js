
// Curated Cloud, DevOps, DevSecOps, and production-engineering learning paths.
export const topics = [
  {
    name: "AWS",
    icon: "☁",
    categories: [
      {
        name: "Compute",
        items: [
          "EC2", "Auto Scaling", "Elastic Load Balancing (ALB/NLB)",
          "Lambda", "Elastic Beanstalk", "AWS Batch", "Lightsail",
          "App Runner", "ECS", "EKS", "Fargate", "Outposts",
        ],
      },
      {
        name: "Storage",
        items: [
          "S3", "S3 Glacier", "EBS", "EFS", "FSx",
          "Storage Gateway", "AWS Backup", "DataSync", "Transfer Family",
        ],
      },
      {
        name: "Networking & CDN",
        items: [
          "VPC", "Subnets", "Route Tables", "Internet Gateway",
          "NAT Gateway", "Security Groups", "Network ACLs", "Route 53",
          "CloudFront", "Direct Connect", "Site-to-Site VPN",
          "Transit Gateway", "PrivateLink", "Global Accelerator",
          "AWS WAF", "AWS Shield",
        ],
      },
      {
        name: "Identity & Security",
        items: [
          "IAM", "IAM Identity Center", "Organizations", "Control Tower",
          "KMS", "Secrets Manager", "Systems Manager Parameter Store",
          "Certificate Manager (ACM)", "Cognito", "GuardDuty",
          "Inspector", "Security Hub", "Macie", "Detective",
          "CloudHSM", "Artifact",
        ],
      },
      {
        name: "Databases",
        items: [
          "RDS", "Aurora", "DynamoDB", "ElastiCache", "DocumentDB",
          "Neptune", "Redshift", "Keyspaces", "MemoryDB",
          "Timestream", "QLDB",
        ],
      },
      {
        name: "AI & Machine Learning",
        items: [
          "Amazon Bedrock", "SageMaker AI", "Rekognition", "Textract",
          "Comprehend", "Lex", "Polly", "Transcribe", "Translate",
          "Kendra", "Personalize", "Q Developer",
        ],
      },
      {
        name: "Data Analytics & Streaming",
        items: [
          "Athena", "Glue", "Lake Formation", "EMR",
          "OpenSearch Service", "Kinesis Data Streams",
          "Kinesis Data Firehose",
          "Managed Service for Apache Flink", "QuickSight",
          "DataZone", "MSK (Managed Kafka)",
        ],
      },
      {
        name: "Application Integration",
        items: [
          "API Gateway", "SQS", "SNS", "EventBridge",
          "Step Functions", "Amazon MQ", "AppFlow", "AppSync",
        ],
      },
      {
        name: "Developer Tools & CI/CD",
        items: [
          "CodeBuild", "CodeDeploy", "CodePipeline",
          "CodeArtifact", "CloudShell", "X-Ray",
          "Cloud Development Kit (CDK)",
        ],
      },
      {
        name: "Management & Governance",
        items: [
          "CloudWatch", "CloudTrail", "AWS Config",
          "Trusted Advisor", "Systems Manager", "Service Catalog",
          "CloudFormation", "AWS Health Dashboard",
          "Compute Optimizer", "Cost Explorer", "Budgets",
          "Pricing Calculator", "Well-Architected Tool",
        ],
      },
    ],
  },

  {
    name: "Docker",
    icon: "▣",
    categories: [
      {
        name: "Core Concepts",
        items: [
          "Images", "Containers", "Docker Engine", "Dockerfile",
          "Docker CLI", "Docker Hub", "Registries", "Volumes",
          "Bind Mounts", "Docker Networks", "Container Lifecycle",
        ],
      },
      {
        name: "Build & Compose",
        items: [
          "Multi-stage Builds", "BuildKit", "Docker Compose",
          "Environment Variables", "Health Checks", "Secrets in Compose",
        ],
      },
      {
        name: "Security & Operations",
        items: [
          "Non-root Containers", "Image Scanning", "Image Tagging",
          "Resource Limits", "Logging Drivers",
          "Troubleshooting Containers",
        ],
      },
    ],
  },

  {
    name: "Kubernetes",
    icon: "⎈",
    categories: [
      {
        name: "Architecture & Workloads",
        items: [
          "Cluster Architecture", "Control Plane", "Nodes", "Pods",
          "ReplicaSets", "Deployments", "StatefulSets", "DaemonSets",
          "Jobs & CronJobs", "Namespaces", "Labels & Selectors",
        ],
      },
      {
        name: "Networking & Traffic",
        items: [
          "Services", "ClusterIP", "NodePort", "LoadBalancer Service",
          "Ingress", "Ingress Controllers", "Network Policies",
          "CoreDNS", "Service Mesh",
        ],
      },
      {
        name: "Configuration & Storage",
        items: [
          "ConfigMaps", "Secrets", "PersistentVolumes",
          "PersistentVolumeClaims", "StorageClasses", "Probes",
        ],
      },
      {
        name: "Security & Access",
        items: [
          "RBAC", "Service Accounts", "Pod Security Standards",
          "Security Context", "Sealed Secrets", "External Secrets",
        ],
      },
      {
        name: "Scaling & Operations",
        items: [
          "HPA", "VPA", "Cluster Autoscaler", "Requests & Limits",
          "Rolling Updates", "Helm", "Kustomize", "kubectl",
          "Troubleshooting", "EKS",
        ],
      },
    ],
  },

  {
    name: "Terraform",
    icon: "⌘",
    categories: [
      {
        name: "Core & Language",
        items: [
          "Providers", "Resources", "Data Sources", "Variables",
          "Outputs", "Locals", "Expressions & Functions",
          "For Each & Count",
        ],
      },
      {
        name: "State & Modules",
        items: [
          "Terraform State", "Remote State", "State Locking",
          "Import", "Modules", "Workspaces",
        ],
      },
      {
        name: "Workflow & Quality",
        items: [
          "init", "fmt", "validate", "plan", "apply", "destroy",
          "Lifecycle Meta-Arguments", "TFLint", "tfsec", "Checkov",
        ],
      },
      {
        name: "AWS Infrastructure Patterns",
        items: [
          "VPC with Terraform", "EC2 with Terraform", "S3 with Terraform",
          "ALB & ASG", "IAM Policies", "EKS with Terraform",
        ],
      },
    ],
  },

  {
    name: "Jenkins",
    icon: "♾",
    categories: [
      {
        name: "Pipeline Fundamentals",
        items: [
          "Jenkins Architecture", "Controller & Agents", "Pipeline Jobs",
          "Declarative Pipeline", "Scripted Pipeline", "Jenkinsfile",
          "Stages & Steps", "Parameters",
        ],
      },
      {
        name: "Integrations & Delivery",
        items: [
          "GitHub Webhooks", "SCM Checkout", "Credentials Store",
          "Docker Builds", "Kubernetes Agents", "Artifact Publishing",
          "Deployment Pipelines",
        ],
      },
    ],
  },

  {
    name: "Git & GitHub",
    icon: "⑂",
    categories: [
      {
        name: "Git Basics",
        items: [
          "Repositories", "clone", "status", "add & commit",
          "branch & switch", "merge", "rebase", "stash",
          "reset & revert", "tags",
        ],
      },
      {
        name: "GitHub Collaboration",
        items: [
          "Pull Requests", "Code Reviews", "Branch Protection",
          "GitHub Actions", "GitHub Secrets", "Environments",
          "GitHub Releases",
        ],
      },
    ],
  },

  {
    name: "CI/CD & GitOps",
    icon: "⇄",
    categories: [
      {
        name: "Pipelines",
        items: [
          "CI vs CD", "Build-Test-Deploy Workflow", "GitHub Actions",
          "GitLab CI/CD", "Azure Pipelines", "AWS CodePipeline",
          "Build Artifacts", "Deployment Strategies",
        ],
      },
      {
        name: "Release Strategies",
        items: [
          "Rolling Deployment", "Blue-Green Deployment",
          "Canary Deployment", "Rollback Strategy", "GitOps Principles",
          "Argo CD", "Flux CD",
        ],
      },
    ],
  },

  {
    name: "Linux & Shell",
    icon: "⌁",
    categories: [
      {
        name: "System Fundamentals",
        items: [
          "Linux Filesystem", "Users & Groups", "Permissions",
          "Processes", "systemd & Services", "Package Managers",
          "Environment Variables", "SSH", "Cron Jobs",
        ],
      },
      {
        name: "Networking & Troubleshooting",
        items: [
          "grep, awk & sed", "curl & wget", "DNS Tools",
          "Ports & Sockets", "Disk & Memory", "Logs & journalctl",
          "Bash Scripting", "Exit Codes",
        ],
      },
    ],
  },

  {
    name: "Ansible",
    icon: "✣",
    categories: [
      {
        name: "Automation Basics",
        items: [
          "Inventory", "Ad-hoc Commands", "Playbooks",
          "Tasks & Handlers", "Variables", "Facts", "Templates",
          "Conditionals & Loops",
        ],
      },
      {
        name: "Reusable Automation",
        items: [
          "Roles", "Collections", "Ansible Galaxy", "Vault",
          "Dynamic Inventory", "Configuration Management",
          "Idempotency",
        ],
      },
    ],
  },

  {
    name: "Monitoring & Observability",
    icon: "◉",
    categories: [
      {
        name: "Metrics & Dashboards",
        items: [
          "Prometheus", "Grafana", "Alertmanager", "CloudWatch Metrics",
          "Dashboards", "SLI / SLO / SLA",
        ],
      },
      {
        name: "Logs & Traces",
        items: [
          "ELK / Elastic Stack", "OpenSearch Dashboards", "Fluent Bit",
          "Loki", "Jaeger", "OpenTelemetry", "Distributed Tracing",
        ],
      },
    ],
  },

  {
    name: "DevSecOps",
    icon: "⬡",
    categories: [
      {
        name: "Code & Dependency Security",
        items: [
          "SAST vs DAST", "SonarQube", "Semgrep",
          "Dependency Scanning", "OWASP Top 10", "Secret Scanning",
          "Software Composition Analysis",
        ],
      },
      {
        name: "Container & IaC Security",
        items: [
          "Trivy", "Snyk", "tfsec", "Checkov",
          "Container Image Hardening", "SBOM", "Image Signing",
          "Policy as Code",
        ],
      },
      {
        name: "Secrets & Cloud Security",
        items: [
          "Least Privilege", "Secrets Management",
          "Kubernetes Sealed Secrets", "HashiCorp Vault",
          "IAM Best Practices", "Threat Modeling", "Incident Response",
        ],
      },
    ],
  },

  // NEW: Networking & Infrastructure
  {
    name: "Networking & Infrastructure",
    icon: "⌘",
    categories: [
      {
        name: "Network Fundamentals",
        items: [
          "OSI & TCP/IP Models", "IPv4 & IPv6", "CIDR & Subnetting",
          "DNS Resolution", "DHCP", "ARP", "Routing & Route Tables",
          "Ports & Protocols", "HTTP & HTTPS", "TLS / SSL",
          "SSH", "NAT & PAT",
        ],
      },
      {
        name: "Cloud Networking",
        items: [
          "VPC / VNet Design", "Public & Private Subnets",
          "Internet & NAT Gateways", "Security Groups & NACLs",
          "Load Balancers", "Reverse Proxies", "VPN Connectivity",
          "Private Endpoints", "Peering & Transit Networks",
          "Network ACL Troubleshooting",
        ],
      },
      {
        name: "Network Troubleshooting",
        items: [
          "ping & traceroute", "dig & nslookup", "curl & wget",
          "ss & netstat", "tcpdump", "openssl s_client",
          "Connection Timeouts", "DNS Failures",
          "TLS Certificate Errors", "Packet Flow Analysis",
        ],
      },
    ],
  },

  // NEW: Scripting & Automation
  {
    name: "Scripting & Automation",
    icon: "⌨",
    categories: [
      {
        name: "Shell & Programming",
        items: [
          "Bash Fundamentals", "Bash Functions & Scripts",
          "Python for DevOps", "PowerShell Fundamentals",
          "Error Handling & Exit Codes", "Regular Expressions",
          "Working with Files & JSON", "YAML & Configuration Files",
        ],
      },
      {
        name: "Automation & APIs",
        items: [
          "AWS CLI", "Boto3", "REST APIs", "jq & yq",
          "Cron & Scheduled Jobs", "Environment Variables",
          "SSH Automation", "Webhook Automation",
          "Idempotent Scripts", "Retries & Backoff",
        ],
      },
    ],
  },

  // NEW: GitLab CI/CD
  {
    name: "GitLab CI/CD",
    icon: "◈",
    categories: [
      {
        name: "Pipeline Fundamentals",
        items: [
          ".gitlab-ci.yml", "Pipeline Stages & Jobs",
          "Runners & Executors", "Job Dependencies",
          "Rules & Workflow", "Variables & Secrets",
          "Artifacts & Cache",
        ],
      },
      {
        name: "Delivery & Troubleshooting",
        items: [
          "Docker Build Jobs", "Deployments with SSH",
          "Environments", "Container Registry",
          "Merge Request Pipelines", "Pipeline Debugging",
          "Runner Troubleshooting", "Deployment Rollbacks",
        ],
      },
    ],
  },

  // NEW: Argo CD & GitOps
  {
    name: "Argo CD & GitOps",
    icon: "⎈",
    categories: [
      {
        name: "GitOps Fundamentals",
        items: [
          "GitOps Principles", "Argo CD Architecture",
          "Applications & AppProjects", "Git Repositories",
          "Sync Policies", "Auto-Sync & Self-Heal",
          "Pruning & Resource Hooks",
        ],
      },
      {
        name: "Operations & Troubleshooting",
        items: [
          "Helm Applications", "Kustomize Applications",
          "App of Apps Pattern", "Multi-Cluster Deployments",
          "RBAC & SSO", "OutOfSync Resources", "Sync Failures",
          "Health Assessment", "Rollback & History",
        ],
      },
    ],
  },

  // NEW: Helm & Kubernetes Packaging
  {
    name: "Helm & Kubernetes Packaging",
    icon: "⎈",
    categories: [
      {
        name: "Chart Fundamentals",
        items: [
          "Helm Architecture", "Charts & Repositories", "Chart.yaml",
          "values.yaml", "Templates & Functions", "Helm Install & Upgrade",
          "Helm Dependencies", "Helm Hooks",
        ],
      },
      {
        name: "Release Operations",
        items: [
          "Values Precedence", "Template Debugging", "Release History",
          "Rollback Releases", "Chart Testing", "OCI Registries",
          "Troubleshooting Failed Releases",
        ],
      },
    ],
  },

  // NEW: Grafana & Dashboards
  {
    name: "Grafana & Dashboards",
    icon: "◉",
    categories: [
      {
        name: "Dashboards & Queries",
        items: [
          "Grafana Architecture", "Data Sources",
          "Prometheus Queries (PromQL)", "Dashboard Design",
          "Variables & Templating", "Annotations",
          "Dashboard Provisioning",
        ],
      },
      {
        name: "Alerting & Operations",
        items: [
          "Alert Rules", "Contact Points & Notifications",
          "Alert Routing", "Silences", "Provisioning as Code",
          "Datasource Troubleshooting", "Dashboard Performance",
        ],
      },
    ],
  },

  // NEW: SRE & Production Engineering
  {
    name: "SRE & Production Engineering",
    icon: "⚙",
    categories: [
      {
        name: "Reliability Fundamentals",
        items: [
          "SRE Principles", "SLI / SLO / SLA", "Error Budgets",
          "Availability & Reliability", "High Availability",
          "Fault Tolerance", "Capacity Planning",
          "Performance & Load Testing",
        ],
      },
      {
        name: "Incident Management",
        items: [
          "Incident Response", "On-call Practices",
          "Runbooks & Playbooks", "Root Cause Analysis",
          "Postmortems", "Disaster Recovery", "RTO & RPO",
          "Backup & Restore Testing", "Chaos Engineering",
        ],
      },
    ],
  },

  // NEW: Service Mesh & Traffic
  {
    name: "Service Mesh & Traffic",
    icon: "⇄",
    categories: [
      {
        name: "Service Mesh Concepts",
        items: [
          "Service Mesh Architecture", "Istio", "Linkerd",
          "Envoy Proxy", "Sidecar & Ambient Patterns", "mTLS",
          "Service-to-Service Traffic",
        ],
      },
      {
        name: "Traffic Management",
        items: [
          "Retries & Timeouts", "Circuit Breaking",
          "Traffic Splitting", "Canary Releases",
          "Ingress & Egress Gateways", "Service Mesh Observability",
          "Mesh Troubleshooting",
        ],
      },
    ],
  },

  // NEW: Infrastructure Provisioning
  {
    name: "Infrastructure Provisioning",
    icon: "▦",
    categories: [
      {
        name: "Provisioning Tools",
        items: [
          "OpenTofu", "Terragrunt", "Pulumi",
          "AWS CloudFormation", "AWS CDK", "Packer", "Vagrant",
        ],
      },
      {
        name: "Infrastructure Quality",
        items: [
          "Reusable Modules", "Environment Promotion",
          "Drift Detection", "Policy as Code",
          "Infrastructure Testing", "Terratest",
          "Cost Estimation", "Safe Change & Rollback",
        ],
      },
    ],
  },

  // NEW: Secrets & Identity Management
  {
    name: "Secrets & Identity Management",
    icon: "♢",
    categories: [
      {
        name: "Secrets Platforms",
        items: [
          "HashiCorp Vault", "AWS Secrets Manager",
          "SSM Parameter Store", "External Secrets Operator",
          "Kubernetes Sealed Secrets", "Secret Rotation",
          "Dynamic Credentials",
        ],
      },
      {
        name: "Identity & Access",
        items: [
          "IAM Roles & Policies", "OIDC Workload Identity",
          "RBAC", "Service Accounts", "Short-Lived Credentials",
          "Least Privilege", "Credential Leak Response",
        ],
      },
    ],
  },
];
