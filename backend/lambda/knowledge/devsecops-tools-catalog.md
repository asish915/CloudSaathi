# DevSecOps Tools and Practices

DevSecOps integrates security into design, source control, build, deployment, and runtime operations. Explain what each scanner covers and its limitations; a clean scan is not proof that software is secure.

## Secure coding and static analysis (SAST)
- SonarQube, Semgrep, GitHub CodeQL, Checkmarx, Fortify, Bandit for Python, and language-specific linters.
- Use peer review, secure coding standards, and threat modeling alongside automated checks.

## Dynamic testing and API security (DAST)
- OWASP ZAP, Burp Suite, Nuclei, and appropriate API tests against authorized non-production targets.
- Never scan systems without permission.

## Dependencies and software composition analysis (SCA)
- Snyk, Dependabot, OWASP Dependency-Check, OSV-Scanner, Black Duck, and Trivy.
- Track vulnerable direct/transitive dependencies, license policy, remediation, and exceptions.

## Container and artifact security
- Trivy, Grype, Anchore, Clair, Docker Scout, Aqua, and Prisma Cloud can help assess images or artifacts.
- Use small trusted base images, pin versions/digests, rebuild patched images, and sign/verify artifacts where supported.
- Syft can generate SBOMs; Cosign/Sigstore support artifact signing and verification; SLSA describes supply-chain assurance levels/practices.

## Infrastructure-as-code and cloud posture
- Checkov, tfsec, Terrascan, KICS, Conftest, Prowler, ScoutSuite, and CloudSploit.
- AWS-native controls include IAM Access Analyzer, AWS Config, GuardDuty, Inspector, Macie, Security Hub, CloudTrail, WAF, and KMS.
- Validate Terraform plans and modules, enforce least privilege, restrict public exposure, encrypt data, and enable audit logs.

## Secrets, policy, and runtime protection
- Gitleaks and TruffleHog detect potential exposed secrets; HashiCorp Vault and AWS Secrets Manager manage secrets.
- Open Policy Agent (OPA)/Conftest and Kyverno enforce policies; Falco can detect suspicious runtime behavior in supported environments; kube-bench checks Kubernetes against CIS benchmarks; Kubescape supports Kubernetes security posture checks.
- Use Kubernetes RBAC, network policies, admission controls, and protected secret handling.

## Example CI security sequence
1. Secret scanning and linting at pull request.
2. SAST and dependency scanning.
3. IaC scanning and policy validation before infrastructure changes.
4. Build container and generate an SBOM.
5. Scan image, sign artifact, and publish only after policy checks pass.
6. Deploy to a test environment and run authorized DAST/API tests.
7. Monitor findings and patch/remediate with a documented exception process.

Security frameworks to explain when relevant include OWASP Top 10, CIS Benchmarks, NIST Secure Software Development Framework, NIST Cybersecurity Framework, and applicable compliance requirements. Verify current tool capabilities and licensing from official documentation.
