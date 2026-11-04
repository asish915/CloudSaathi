# AWS Service Catalog for CloudSaathi

Use this guide to explain AWS services by category. These are representative services, not an exhaustive list of every AWS offering; AWS launches and retires services over time, so verify current availability and regional support in AWS documentation.

## Compute and serverless
- Amazon EC2: virtual machines with OS-level control; use for custom servers and workloads needing flexible compute.
- AWS Lambda: event-driven functions without managing servers; use for APIs, automation, and event processing.
- AWS Elastic Beanstalk: managed application deployment platform.
- Amazon ECS and Amazon EKS: managed container orchestration; ECS is AWS-native and EKS provides managed Kubernetes.
- AWS Fargate: serverless compute for containers.
- AWS Batch: batch-job scheduling and compute.
- AWS App Runner: managed deployment of web apps and APIs.
- AWS Lightsail: simplified virtual private servers and application hosting.

## Storage and backup
- Amazon S3: durable object storage for files, artifacts, data lakes, and static assets.
- Amazon EBS: block volumes for EC2.
- Amazon EFS: elastic shared NFS file storage for Linux workloads.
- Amazon FSx: managed file systems for specialized workloads.
- S3 Glacier storage classes: lower-cost archival storage with different retrieval characteristics.
- AWS Backup: centralized backup policies and recovery management.
- AWS Storage Gateway: hybrid on-premises to AWS storage integration.

## Networking and content delivery
- Amazon VPC: logically isolated networking, subnets, route tables, and security boundaries.
- Internet Gateway and NAT Gateway: internet connectivity for public subnets and outbound-only access for private subnets, respectively.
- Elastic Load Balancing: ALB for HTTP/HTTPS application routing, NLB for high-performance transport-layer routing, and Gateway Load Balancer for virtual appliances.
- Amazon Route 53: DNS and health-check-based routing.
- Amazon CloudFront: content delivery network and edge caching.
- AWS Direct Connect and Site-to-Site VPN: private or encrypted connectivity to AWS.
- AWS Transit Gateway: hub-and-spoke connectivity across VPCs and networks.
- AWS PrivateLink: private access to supported services and endpoints.
- AWS Global Accelerator: static anycast IPs and global traffic routing.

## Databases and analytics
- Amazon RDS and Aurora: managed relational databases.
- Amazon DynamoDB: managed key-value/document NoSQL database.
- Amazon ElastiCache: managed in-memory caching.
- Amazon DocumentDB: document database service compatible with MongoDB APIs.
- Amazon Neptune: graph database.
- Amazon Redshift: cloud data warehouse.
- Amazon Athena: serverless SQL queries over data in S3.
- AWS Glue: data integration and ETL.
- Amazon EMR: managed big-data frameworks.
- Amazon Kinesis and Amazon MSK: streaming data services.
- Amazon OpenSearch Service: search and log analytics.
- AWS Lake Formation: data lake governance.
- Amazon QuickSight: business intelligence and dashboards.

## Identity, security, and governance
- AWS IAM: users, roles, policies, and least-privilege access.
- IAM Identity Center: workforce single sign-on and centralized access.
- Amazon Cognito: application user authentication and identity federation.
- AWS KMS and Secrets Manager: key management and managed secret storage/rotation.
- AWS Certificate Manager: TLS certificate management.
- AWS WAF and AWS Shield: web application filtering and DDoS protection.
- Amazon GuardDuty: threat detection; Amazon Inspector: vulnerability management; Amazon Macie: sensitive-data discovery; AWS Security Hub: security findings aggregation.
- AWS CloudTrail: API activity history; AWS Config: resource configuration history and compliance rules.
- AWS Organizations and Control Tower: multi-account governance and landing-zone management.
- Amazon Detective: security investigation; AWS Network Firewall: managed network filtering.

## Monitoring, operations, and application integration
- Amazon CloudWatch: metrics, logs, dashboards, and alarms.
- AWS Systems Manager: fleet operations, patching, parameters, and automation.
- AWS X-Ray: distributed tracing.
- Amazon API Gateway: managed API front door.
- Amazon SQS: message queues; Amazon SNS: pub/sub notifications; Amazon EventBridge: event routing.
- AWS Step Functions: workflow orchestration.
- AWS CodeBuild, CodeDeploy, CodePipeline, and CodeArtifact: build, deployment, pipeline orchestration, and artifact storage.
- AWS CloudFormation and AWS CDK: infrastructure as code.

## AI, ML, migration, and transfer
- Amazon Bedrock: build generative AI applications with supported foundation models.
- Amazon SageMaker AI: build, train, and deploy machine-learning models.
- Amazon Textract, Rekognition, Comprehend, Lex, Polly, Transcribe, and Translate: document, image/video, text, conversational, speech, and translation capabilities.
- AWS Database Migration Service: database migration and replication.
- AWS Application Migration Service: lift-and-shift server migration.
- AWS DataSync and Transfer Family: managed data movement and file transfer.
- AWS Snow Family: edge data collection and transfer for suitable scenarios.

When asked to design an architecture, select services based on requirements, explain alternatives and trade-offs, use least privilege, and remind learners to check pricing, quotas, and regional availability before deployment.
