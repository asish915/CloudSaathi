import { useEffect, useId, useRef, useState } from "react";
import awsLogo from "./assets/logos/aws.svg";
import dockerLogo from "./assets/logos/docker.svg";
import kubernetesLogo from "./assets/logos/kubernetes.svg";
import terraformLogo from "./assets/logos/terraform.svg";
import jenkinsLogo from "./assets/logos/jenkins.svg";
import githubLogo from "./assets/logos/github.svg";
import gitLogo from "./assets/logos/git.svg";
import gitlabLogo from "./assets/logos/gitlab.svg";
import githubActionsLogo from "./assets/logos/githubactions.svg";
import linuxLogo from "./assets/logos/linux.svg";
import ansibleLogo from "./assets/logos/ansible.svg";
import prometheusLogo from "./assets/logos/prometheus.svg";
import snykLogo from "./assets/logos/snyk.svg";
import cloudSaathiLogo from "./assets/logos/cloudsaathi.svg";

function CloudSaathiLogo({ small = false }) {
  return (
    <img
      className={`cloudsaathi-logo ${small ? "small" : ""}`}
      src={cloudSaathiLogo}
      alt=""
      width="48"
      height="48"
      loading="eager"
      decoding="async"
    />
  );
}

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInputQuickReply(question) {
  const value = question.trim();

  if (
    /^(hi+|hello+|hey+|hii+|good morning|good afternoon|good evening|how are you|haow are u |thanks|thank you|ok+|okay+)[!.\s😊👋]*$/iu.test(
      value,
    )
  ) {
    if (/^(hi+|hello+|hey+|hii+)/i.test(value))
      return "Hello!👋 What cloud or DevOps topic can I help you learn?";

    if (/^good morning/i.test(value))
      return "Good morning! ☀️ What would you like to learn today?";

    if (/^good afternoon/i.test(value))
      return "Good afternoon! What cloud or DevOps question can I help with?";

    if (/^good evening/i.test(value))
      return "Good evening! What would you like to explore?";

    if (/^how are you/i.test(value))
      return "I'm ready to help! What cloud or DevOps question do you have?";

    return "You're welcome! 😊 Ask whenever you're ready to learn.";
  }

  if (!/[a-z0-9]/i.test(value) || /^[\W_]+$/.test(value)) {
    return "I couldn't identify a question. Please ask about AWS, cloud computing, DevOps, DevSecOps,  CI/CD, Linux, containers, infrastructure, or security.";
  }

  return null;
}

function cleanMentorAnswer(answer) {
  return String(answer || "")
    .replace(
      /^\s\*(?:Certainly!?\s\*)?(?:Here(?:'s| is) a mentor-style response to your question:?|User question:.\*|Answer as CloudSaathi:?)/gim,
      "",
    )

    .replace(/^\s\*(?:As CloudSaathi,?\s\*)?(?:the answer is:?)/gim, "")

    .replace(/\n{3,}/g, "\n\n")

    .trim();
}

function getIntroReply(question) {
  const q = question
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

  if (
    /\b(who are you|who r u|who r you|what are you|introduce yourself|tell me about yourself|about you|about cloudsaathi|who built you|who built u|who created you|who created u|who made you|who made u|who developed you|who developed u|who is your creator|who is your developer|who owns you)\b/.test(
      q,
    )
  ) {
    return "I'm CloudSaathi, a cloud and DevOps AI mentor created by Asish Sarangi as a learning project. I help explain concepts, plan architectures, troubleshoot deployments, and provide practical examples.";
  }

  if (
    /\b(what can you do|how can you help|how do you help|what do you help with|your capabilities|what can i ask|how to use you)\b/.test(
      q,
    )
  ) {
    return "I can teach cloud and DevOps concepts step by step, compare technologies, plan architectures, explain commands, and troubleshoot errors. Ask a specific question and we'll work through it together.";
  }

  return null;
}

const stackBrandAssets = {
  AWS: awsLogo,
  Docker: dockerLogo,
  Kubernetes: kubernetesLogo,
  Terraform: terraformLogo,
  Jenkins: jenkinsLogo,
  "Git & GitHub": gitLogo,
  "CI/CD & GitOps": githubActionsLogo,
  "Linux & Shell": linuxLogo,
  Ansible: ansibleLogo,
  "Monitoring & Observability": prometheusLogo,
  DevSecOps: snykLogo,
};

function StackBrandIcon({ name, fallback }) {
  const logo = stackBrandAssets[name];

  if (!logo) {
    return (
      <span className="stack-icon" aria-hidden="true">
        {fallback}
      </span>
    );
  }

  return (
    <span
      className={`stack-icon brand-stack-icon${name === "AWS" ? " aws-brand-icon" : ""}`}
      aria-hidden="true"
    >
      <img
        src={logo}
        alt={`${name} logo`}
        width="24"
        height="24"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

const topics = [
  {
    name: "AWS",
    icon: "☁",
    categories: [
      {
        name: "Compute",
        items: [
          "EC2",
          "Auto Scaling",
          "Elastic Load Balancing (ALB/NLB)",
          "Lambda",
          "Elastic Beanstalk",
          "AWS Batch",
          "Lightsail",
          "App Runner",
          "ECS",
          "EKS",
          "Fargate",
          "Outposts",
        ],
      },

      {
        name: "Storage",
        items: [
          "S3",
          "S3 Glacier",
          "EBS",
          "EFS",
          "FSx",
          "Storage Gateway",
          "AWS Backup",
          "DataSync",
          "Transfer Family",
        ],
      },

      {
        name: "Networking & CDN",
        items: [
          "VPC",
          "Subnets",
          "Route Tables",
          "Internet Gateway",
          "NAT Gateway",
          "Security Groups",
          "Network ACLs",
          "Route 53",
          "CloudFront",
          "Direct Connect",
          "Site-to-Site VPN",
          "Transit Gateway",
          "PrivateLink",
          "Global Accelerator",
          "AWS WAF",
          "AWS Shield",
        ],
      },

      {
        name: "Identity & Security",
        items: [
          "IAM",
          "IAM Identity Center",
          "Organizations",
          "Control Tower",
          "KMS",
          "Secrets Manager",
          "Systems Manager Parameter Store",
          "Certificate Manager (ACM)",
          "Cognito",
          "GuardDuty",
          "Inspector",
          "Security Hub",
          "Macie",
          "Detective",
          "CloudHSM",
          "Artifact",
        ],
      },

      {
        name: "Databases",
        items: [
          "RDS",
          "Aurora",
          "DynamoDB",
          "ElastiCache",
          "DocumentDB",
          "Neptune",
          "Redshift",
          "Keyspaces",
          "MemoryDB",
          "Timestream",
          "QLDB",
        ],
      },

      {
        name: "AI & Machine Learning",
        items: [
          "Amazon Bedrock",
          "SageMaker AI",
          "Rekognition",
          "Textract",
          "Comprehend",
          "Lex",
          "Polly",
          "Transcribe",
          "Translate",
          "Kendra",
          "Personalize",
          "Q Developer",
        ],
      },

      {
        name: "Data Analytics & Streaming",
        items: [
          "Athena",
          "Glue",
          "Lake Formation",
          "EMR",
          "OpenSearch Service",
          "Kinesis Data Streams",
          "Kinesis Data Firehose",
          "Managed Service for Apache Flink",
          "QuickSight",
          "DataZone",
          "MSK (Managed Kafka)",
        ],
      },

      {
        name: "Application Integration",
        items: [
          "API Gateway",
          "SQS",
          "SNS",
          "EventBridge",
          "Step Functions",
          "Amazon MQ",
          "AppFlow",
          "AppSync",
        ],
      },

      {
        name: "Developer Tools & CI/CD",
        items: [
          "CodeBuild",
          "CodeDeploy",
          "CodePipeline",
          "CodeArtifact",
          "CloudShell",
          "X-Ray",
          "Cloud Development Kit (CDK)",
        ],
      },

      {
        name: "Management & Governance",
        items: [
          "CloudWatch",
          "CloudTrail",
          "AWS Config",
          "Trusted Advisor",
          "Systems Manager",
          "Service Catalog",
          "CloudFormation",
          "AWS Health Dashboard",
          "Compute Optimizer",
          "Cost Explorer",
          "Budgets",
          "Pricing Calculator",
          "Well-Architected Tool",
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
          "Images",
          "Containers",
          "Docker Engine",
          "Dockerfile",
          "Docker CLI",
          "Docker Hub",
          "Registries",
          "Volumes",
          "Bind Mounts",
          "Docker Networks",
          "Container Lifecycle",
        ],
      },

      {
        name: "Build & Compose",
        items: [
          "Multi-stage Builds",
          "BuildKit",
          "Docker Compose",
          "Environment Variables",
          "Health Checks",
          "Secrets in Compose",
        ],
      },

      {
        name: "Security & Operations",
        items: [
          "Non-root Containers",
          "Image Scanning",
          "Image Tagging",
          "Resource Limits",
          "Logging Drivers",
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
          "Cluster Architecture",
          "Control Plane",
          "Nodes",
          "Pods",
          "ReplicaSets",
          "Deployments",
          "StatefulSets",
          "DaemonSets",
          "Jobs & CronJobs",
          "Namespaces",
          "Labels & Selectors",
        ],
      },

      {
        name: "Networking & Traffic",
        items: [
          "Services",
          "ClusterIP",
          "NodePort",
          "LoadBalancer Service",
          "Ingress",
          "Ingress Controllers",
          "Network Policies",
          "CoreDNS",
          "Service Mesh",
        ],
      },

      {
        name: "Configuration & Storage",
        items: [
          "ConfigMaps",
          "Secrets",
          "PersistentVolumes",
          "PersistentVolumeClaims",
          "StorageClasses",
          "Probes",
        ],
      },

      {
        name: "Security & Access",
        items: [
          "RBAC",
          "Service Accounts",
          "Pod Security Standards",
          "Security Context",
          "Sealed Secrets",
          "External Secrets",
        ],
      },

      {
        name: "Scaling & Operations",
        items: [
          "HPA",
          "VPA",
          "Cluster Autoscaler",
          "Requests & Limits",
          "Rolling Updates",
          "Helm",
          "Kustomize",
          "kubectl",
          "Troubleshooting",
          "EKS",
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
          "Providers",
          "Resources",
          "Data Sources",
          "Variables",
          "Outputs",
          "Locals",
          "Expressions & Functions",
          "For Each & Count",
        ],
      },

      {
        name: "State & Modules",
        items: [
          "Terraform State",
          "Remote State",
          "State Locking",
          "Import",
          "Modules",
          "Workspaces",
        ],
      },

      {
        name: "Workflow & Quality",
        items: [
          "init",
          "fmt",
          "validate",
          "plan",
          "apply",
          "destroy",
          "Lifecycle Meta-Arguments",
          "TFLint",
          "tfsec",
          "Checkov",
        ],
      },

      {
        name: "AWS Infrastructure Patterns",
        items: [
          "VPC with Terraform",
          "EC2 with Terraform",
          "S3 with Terraform",
          "ALB & ASG",
          "IAM Policies",
          "EKS with Terraform",
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
          "Jenkins Architecture",
          "Controller & Agents",
          "Pipeline Jobs",
          "Declarative Pipeline",
          "Scripted Pipeline",
          "Jenkinsfile",
          "Stages & Steps",
          "Parameters",
        ],
      },
      {
        name: "Integrations & Delivery",
        items: [
          "GitHub Webhooks",
          "SCM Checkout",
          "Credentials Store",
          "Docker Builds",
          "Kubernetes Agents",
          "Artifact Publishing",
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
          "Repositories",
          "clone",
          "status",
          "add & commit",
          "branch & switch",
          "merge",
          "rebase",
          "stash",
          "reset & revert",
          "tags",
        ],
      },
      {
        name: "GitHub Collaboration",
        items: [
          "Pull Requests",
          "Code Reviews",
          "Branch Protection",
          "GitHub Actions",
          "GitHub Secrets",
          "Environments",
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
          "CI vs CD",
          "Build-Test-Deploy Workflow",
          "GitHub Actions",
          "GitLab CI/CD",
          "Azure Pipelines",
          "AWS CodePipeline",
          "Build Artifacts",
          "Deployment Strategies",
        ],
      },
      {
        name: "Release Strategies",
        items: [
          "Rolling Deployment",
          "Blue-Green Deployment",
          "Canary Deployment",
          "Rollback Strategy",
          "GitOps Principles",
          "Argo CD",
          "Flux CD",
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
          "Linux Filesystem",
          "Users & Groups",
          "Permissions",
          "Processes",
          "systemd & Services",
          "Package Managers",
          "Environment Variables",
          "SSH",
          "Cron Jobs",
        ],
      },
      {
        name: "Networking & Troubleshooting",
        items: [
          "grep, awk & sed",
          "curl & wget",
          "DNS Tools",
          "Ports & Sockets",
          "Disk & Memory",
          "Logs & journalctl",
          "Bash Scripting",
          "Exit Codes",
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
          "Inventory",
          "Ad-hoc Commands",
          "Playbooks",
          "Tasks & Handlers",
          "Variables",
          "Facts",
          "Templates",
          "Conditionals & Loops",
        ],
      },
      {
        name: "Reusable Automation",
        items: [
          "Roles",
          "Collections",
          "Ansible Galaxy",
          "Vault",
          "Dynamic Inventory",
          "Configuration Management",
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
          "Prometheus",
          "Grafana",
          "Alertmanager",
          "CloudWatch Metrics",
          "Dashboards",
          "SLI / SLO / SLA",
        ],
      },
      {
        name: "Logs & Traces",
        items: [
          "ELK / Elastic Stack",
          "OpenSearch Dashboards",
          "Fluent Bit",
          "Loki",
          "Jaeger",
          "OpenTelemetry",
          "Distributed Tracing",
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
          "SAST vs DAST",
          "SonarQube",
          "Semgrep",
          "Dependency Scanning",
          "OWASP Top 10",
          "Secret Scanning",
          "Software Composition Analysis",
        ],
      },
      {
        name: "Container & IaC Security",
        items: [
          "Trivy",
          "Snyk",
          "tfsec",
          "Checkov",
          "Container Image Hardening",
          "SBOM",
          "Image Signing",
          "Policy as Code",
        ],
      },
      {
        name: "Secrets & Cloud Security",
        items: [
          "Least Privilege",
          "Secrets Management",
          "Kubernetes Sealed Secrets",
          "HashiCorp Vault",
          "IAM Best Practices",
          "Threat Modeling",
          "Incident Response",
        ],
      },
    ],
  },
];

function formatMessageTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value || Date.now()));
}

function renderInline(text) {
  const tokens = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return tokens.map((token, index) => {
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code className="inline-code" key={index}>
          {token.slice(1, -1)}
        </code>
      );
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }

    return <span key={index}>{token}</span>;
  });
}

function renderMarkdownTable(lines, key) {
  const tableLines = lines.filter((line) => line.trim().startsWith("|"));

  if (tableLines.length < 2) return null;

  const parseRow = (line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  const isSeparator = (line) =>
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());

  const rows = tableLines.filter((line) => !isSeparator(line)).map(parseRow);

  if (rows.length < 2) return null;

  const headers = rows[0];

  const bodyRows = rows.slice(1);

  return (
    <div className="table-scroll" key={key}>
      <table className="answer-table">
        <thead>
          <tr>
            {headers.map((cell, i) => (
              <th key={i}>{renderInline(cell)}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri}>
              {headers.map((_, ci) => (
                <td key={ci}>{renderInline(row[ci] || "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function splitMarkdownBlocks(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraphLines = [];
  let codeLines = null;
  let codeFence = "";
  let codeLanguage = "";

  const flushParagraph = () => {
    paragraphLines
      .join("\n")
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)
      .forEach((content) => blocks.push({ type: "markdown", content }));
    paragraphLines = [];
  };

  for (const line of lines) {
    if (codeLines !== null) {
      const trimmed = line.trim();
      const isClosingFence =
        trimmed.length >= codeFence.length &&
        [...trimmed].every((character) => character === codeFence[0]);

      if (isClosingFence) {
        blocks.push({
          type: "code",
          language: codeLanguage,
          content: codeLines.join("\n"),
        });
        codeLines = null;
        codeFence = "";
        codeLanguage = "";
      } else {
        codeLines.push(line);
      }
      continue;
    }

    const openingFence = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (openingFence) {
      flushParagraph();
      codeFence = openingFence[1];
      codeLanguage = openingFence[2].trim().split(/\s+/, 1)[0] || "";
      codeLines = [];
    } else {
      paragraphLines.push(line);
    }
  }

  if (codeLines !== null) {
    blocks.push({
      type: "code",
      language: codeLanguage,
      content: codeLines.join("\n"),
    });
  }
  flushParagraph();

  return blocks;
}

const MAX_MERMAID_SOURCE_LENGTH = 10000;

function stripMermaidStyleDirectives(source) {
  return source
    .split(/\r?\n/)
    .filter((line) => {
      if (/^\s*(?:classDef|style)\b/i.test(line)) return false;
      return !/^\s*class\s+[\w.-]+(?:\s*,\s*[\w.-]+)*\s+[A-Za-z_][\w-]*(?:\s*,\s*[A-Za-z_][\w-]*)*\s*;?\s*$/i.test(
        line,
      );
    })
    .join("\n");
}

function MermaidDiagram({ source, theme }) {
  const renderId = `cloudsaathi-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [renderResult, setRenderResult] = useState(null);
  const sourceTooLong = source.length > MAX_MERMAID_SOURCE_LENGTH;

  useEffect(() => {
    if (sourceTooLong) return undefined;

    let cancelled = false;

    async function renderDiagram() {
      try {
        const [{ default: mermaid }, { default: DOMPurify }] = await Promise.all(
          [import("mermaid"), import("dompurify")],
        );

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          secure: [
            "securityLevel",
            "startOnLoad",
            "maxTextSize",
            "suppressErrorRendering",
            "maxEdges",
            "htmlLabels",
            "layout",
          ],
          maxTextSize: MAX_MERMAID_SOURCE_LENGTH,
          suppressErrorRendering: true,
          maxEdges: 60,
          htmlLabels: false,
          layout: "dagre",
          theme: theme === "light" ? "default" : "dark",
        });

        const { svg } = await mermaid.render(
          renderId,
          stripMermaidStyleDirectives(source),
        );
        const sanitizedSvg = DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          FORBID_TAGS: ["foreignObject"],
        });
        if (!sanitizedSvg) {
          throw new Error("Mermaid returned an empty diagram.");
        }

        if (!cancelled) {
          setRenderResult({ source, theme, svg: sanitizedSvg, error: false });
        }
      } catch (error) {
        console.error("Mermaid diagram rendering failed:", error);
        if (!cancelled) {
          setRenderResult({ source, theme, svg: "", error: true });
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [renderId, source, sourceTooLong, theme]);

  const result =
    renderResult?.source === source && renderResult.theme === theme
      ? renderResult
      : null;
  const hasError = sourceTooLong || result?.error;

  return (
    <div className="code-card mermaid-card">
      <div className="code-card-header">
        <span>Diagram</span>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(source)}
        >
          Copy source
        </button>
      </div>
      {result?.svg ? (
        <div
          className="mermaid-diagram"
          role="img"
          aria-label="Generated diagram"
          dangerouslySetInnerHTML={{ __html: result.svg }}
        />
      ) : hasError ? (
        <>
          <div className="mermaid-error" role="status">
            {sourceTooLong
              ? "This diagram is too large to render. Mermaid source is shown below."
              : "This diagram could not be rendered. Mermaid source is shown below."}
          </div>
          <pre>
            <code>{source}</code>
          </pre>
        </>
      ) : (
        <div className="mermaid-status" role="status">
          Rendering diagram…
        </div>
      )}
    </div>
  );
}

function MarkdownContent({ text, theme }) {
  const blocks = splitMarkdownBlocks(text);

  return (
    <div className="formatted-answer">
      {blocks.map((block, index) => {
        if (block.type === "code") {
          if (block.language.toLowerCase() === "mermaid") {
            return (
              <MermaidDiagram
                key={index}
                source={block.content}
                theme={theme}
              />
            );
          }

          return (
            <div className="code-card" key={index}>
              <div className="code-card-header">
                <span>{block.language || "CODE"}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(block.content)}
                >
                  Copy code
                </button>
              </div>
              <pre>
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }

        const trimmed = block.content;

        if (!trimmed) return null;

        const lines = trimmed.split("\n");

        if (
          lines.some((line) => line.trim().startsWith("|")) &&
          lines.filter((line) => line.trim().startsWith("|")).length >= 2
        ) {
          const table = renderMarkdownTable(lines, `table-${index}`);

          if (table) return table;
        }

        if (/^#{1,4}\s/.test(lines[0])) {
          const level = Math.min(4, lines[0].match(/^#+/)[0].length);

          const heading = lines[0].replace(/^#{1,4}\s+/, "");

          const rest = lines.slice(1);

          const Tag = `h${level + 2}`;

          return (
            <section className="answer-section" key={index}>
              <Tag className="answer-heading">{renderInline(heading)}</Tag>
              {rest.length > 0 && (
                <MarkdownContent text={rest.join("\n")} theme={theme} />
              )}
            </section>
          );
        }

        if (lines.every((line) => /^\s*[-*]\s+/.test(line)))
          return (
            <ul className="answer-list" key={index}>
              {lines.map((line, i) => (
                <li key={i}>{renderInline(line.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );

        if (lines.every((line) => /^\s*\d+[.)]\s+/.test(line)))
          return (
            <ol className="answer-list numbered" key={index}>
              {lines.map((line, i) => (
                <li key={i}>
                  {renderInline(line.replace(/^\s*\d+[.)]\s+/, ""))}
                </li>
              ))}
            </ol>
          );

        return (
          <p className="answer-paragraph" key={index}>
            {lines.map((line, i) => (
              <span key={i}>
                {renderInline(line)}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function MessageContent({ text, role, theme }) {
  return role === "assistant" ? (
    <MarkdownContent text={text} theme={theme} />
  ) : (
    <>{text}</>
  );
}

const bootSteps = [
  { status: "INIT", text: "Starting CloudSaathi runtime" },

  { status: "LOAD", text: "Loading cloud and DevOps learning library" },

  { status: "INIT", text: "Preparing chat interface and Markdown renderer" },

  {
    status: "CHECK",
    text: "Chat API will be contacted when you send a message",
  },

  { status: "READY", text: "Frontend startup sequence complete" },
];

function BootScreen({ onComplete, step }) {
  const visibleSteps = bootSteps.slice(0, step + 1);

  const progress = Math.min(
    100,
    Math.round((step / (bootSteps.length - 1)) * 100),
  );

  return (
    <div className="boot-screen" role="status" aria-live="polite">
      <div className="boot-window">
        <div className="boot-titlebar">
          <div className="boot-lights">
            <i />
            <i />
            <i />
          </div>
          <span>cloudsaathi — startup console</span>
          <span className="boot-version">v1.0</span>
        </div>

        <div className="boot-brand">
          <div className="boot-logo">
            <CloudSaathiLogo />
          </div>
          <div>
            <h1 className="cloudsaathi-wordmark">
              CloudSaathi<span>.</span>
            </h1>
            <p>Cloud &amp; DevOps Mentor</p>
          </div>
        </div>

        <div className="boot-terminal">
          <div className="boot-command">
            <span>$</span> cloudsaathi --initialize
          </div>
          {visibleSteps.map((line, index) => (
            <div
              className={`boot-line ${line.status === "READY" ? "is-ready" : ""}`}
              key={line.text}
            >
              <span className="boot-time">
                [{String(index + 1).padStart(2, "0")}]
              </span>
              <span className="boot-status">{line.status}</span>
              <span className="boot-line-text">{line.text}</span>
            </div>
          ))}
          {step < bootSteps.length - 1 && (
            <div className="boot-cursor-line">
              <span className="boot-cursor" /> executing startup tasks...
            </div>
          )}
        </div>

        <div className="boot-progress-meta">
          <span>
            {step === bootSteps.length - 1
              ? "SYSTEM READY"
              : "INITIALIZING SYSTEM"}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="boot-progress">
          <div style={{ width: `${progress}%` }} />
        </div>
        <div className="boot-footer">
          <span>
            <i /> Frontend initialized locally
          </span>
          <button type="button" onClick={onComplete}>
            Skip intro ↗
          </button>
        </div>
      </div>
    </div>
  );
}

function LandingPage({
  onEnter,
  onExitComplete,
  isExiting,
  theme,
  onThemeToggle,
}) {
  useEffect(() => {
    const nodes = document.querySelectorAll(".landing-reveal");

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));

      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -35px 0px" },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`landing-page ${theme === "light" ? "landing-light" : ""} ${isExiting ? "is-exiting" : ""}`}
      onAnimationEnd={(event) => {
        if (isExiting && event.target === event.currentTarget) onExitComplete();
      }}
    >
      <div className="landing-ambient ambient-one" />
      <div className="landing-ambient ambient-two" />
      <div className="landing-grid" />

      <header className="landing-nav glass-surface">
        <a className="landing-brand" href="#home" aria-label="CloudSaathi home">
          <span className="landing-brand-icon">
            <CloudSaathiLogo small />
          </span>
          <span>
            <strong className="cloudsaathi-wordmark">
              CloudSaathi<span>.</span>
            </strong>
            <small>YOUR CLOUD LEARNING COMPANION</small>
          </span>
        </a>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <a href="#experience">Experience</a>
          <a href="#journey">Your journey</a>
          <a href="#toolkit">What you can learn</a>
        </nav>

        <div className="landing-nav-actions">
          <button
            className="landing-theme"
            type="button"
            onClick={onThemeToggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>
          <button className="landing-nav-cta" type="button" onClick={onEnter}>
            Open mentor <span>↗</span>
          </button>
        </div>
      </header>

      <main id="home">
        <section className="landing-hero">
          <div className="landing-hero-copy landing-reveal">
            <div className="landing-eyebrow">
              <span className="eyebrow-pulse" /> A smarter way to master cloud &
              DevOps
            </div>

            <h1>
              Build your future
              <br />
              in the <span>cloud.</span>
            </h1>

            <p>
              From your first Linux command to production-ready cloud
              architecture — learn, experiment, and grow with an AI mentor by
              your side.
            </p>

            <div className="landing-hero-actions">
              <button
                className="landing-primary"
                type="button"
                onClick={onEnter}
              >
                Start learning <span>↗</span>
              </button>
              <a className="landing-secondary" href="#experience">
                Explore the experience <span>↓</span>
              </a>
            </div>

            <div className="landing-trust-row">
              <div className="avatar-stack">
                <i>
                  <img src={awsLogo} alt="AWS" />
                </i>
                <i>
                  <img src={terraformLogo} alt="Terraform" />
                </i>
                <i>
                  <img src={kubernetesLogo} alt="Kubernetes" />
                </i>
              </div>
              <span>One learning space. A whole world of cloud skills.</span>
            </div>
          </div>

          <div
            className="landing-visual landing-reveal"
            aria-label="CloudSaathi learning ecosystem illustration"
          >
            <div className="visual-orbit orbit-a" />
            <div className="visual-orbit orbit-b" />
            <div className="visual-core">
              <CloudSaathiLogo />
              <span>CLOUDSAATHI</span>
              <small>AI LEARNING ENGINE</small>
            </div>

            <div className="float-card float-aws glass-surface">
              <b className="float-icon">
                <img src={awsLogo} alt="" />
              </b>
              <span>
                <strong>AWS</strong>
                <small>Cloud foundations</small>
              </span>
              <i>↗</i>
            </div>

            <div className="float-card float-k8s glass-surface">
              <b className="float-icon">
                <img src={kubernetesLogo} alt="" />
              </b>
              <span>
                <strong>Kubernetes</strong>
                <small>Container orchestration</small>
              </span>
            </div>

            <div className="float-card float-ci glass-surface">
              <b className="float-icon">
                <img src={gitlabLogo} alt="" />
              </b>
              <span>
                <strong>CI / CD</strong>
                <small>Ship with confidence</small>
              </span>
            </div>

            <div className="visual-caption glass-surface">
              <span className="caption-dot" /> YOUR IDEAS, DEPLOYED
            </div>
          </div>

          <a href="#experience" className="landing-scroll-cue">
            <span /> SCROLL TO EXPLORE
          </a>
        </section>

        <section className="landing-intro landing-reveal" id="experience">
          <div className="section-kicker">THE CLOUDSAATHI EXPERIENCE</div>
          <h2>
            Less memorizing.
            <br />
            <em>More understanding.</em>
          </h2>
          <p>
            Cloud technology makes more sense when every concept connects to a
            bigger picture. Learn at your pace, ask without hesitation, and turn
            theory into practical skills.
          </p>
        </section>

        <section className="landing-feature-grid" id="toolkit">
          <article className="landing-feature feature-large glass-surface landing-reveal">
            <div className="feature-topline">
              <span>01 / LEARN</span>
              <b>↗</b>
            </div>
            <div className="feature-art art-terminal">
              <div className="terminal-top">
                <i />
                <i />
                <i />
                <span>cloudsaathi / lesson</span>
              </div>
              <div className="terminal-lines">
                <span>
                  <i>$</i> docker build -t my-app .
                </span>
                <span className="terminal-muted">
                  Building your understanding...
                </span>
                <span className="terminal-success">✓ Concept connected</span>
              </div>
            </div>
            <h3>
              Understand the why,
              <br />
              not just the what.
            </h3>
            <p>
              Explore beginner-friendly explanations, real examples,
              comparisons, and step-by-step breakdowns.
            </p>
          </article>

          <article className="landing-feature glass-surface landing-reveal">
            <div className="feature-topline">
              <span>02 / EXPLORE</span>
              <b>↗</b>
            </div>
            <div className="feature-art art-orbit">
              <span>
                <img src={awsLogo} alt="AWS" />
              </span>
              <i>
                <img src={terraformLogo} alt="Terraform" />
              </i>
              <i>
                <img src={dockerLogo} alt="Docker" />
              </i>
              <i>
                <img src={githubLogo} alt="GitHub" />
              </i>
              <i>
                <img src={kubernetesLogo} alt="Kubernetes" />
              </i>
            </div>
            <h3>
              Your whole tech stack,
              <br />
              in one place.
            </h3>
            <p>
              Move across AWS, Docker, Kubernetes, Terraform, Linux, CI/CD and
              more.
            </p>
          </article>

          <article className="landing-feature glass-surface landing-reveal">
            <div className="feature-topline">
              <span>03 / BUILD</span>
              <b>↗</b>
            </div>
            <div className="feature-art art-flow">
              <span>CODE</span>
              <b>→</b>
              <span>BUILD</span>
              <b>→</b>
              <span>DEPLOY</span>
            </div>
            <h3>
              Connect concepts
              <br />
              to real workflows.
            </h3>
            <p>
              See how tools work together in infrastructure, automation, and
              delivery pipelines.
            </p>
          </article>
        </section>

        <section className="landing-journey landing-reveal" id="journey">
          <div className="journey-heading">
            <div>
              <div className="section-kicker">YOUR NEXT CHAPTER</div>
              <h2>
                Curiosity is a<br />
                <em>great place to start.</em>
              </h2>
            </div>
            <p>
              No perfect starting point needed. Bring a question, choose a
              technology, or follow your curiosity wherever it leads.
            </p>
          </div>
          <div className="journey-steps">
            <div className="journey-step">
              <span>01</span>
              <div>
                <b>Pick a direction</b>
                <small>Choose a topic from the technology library.</small>
              </div>
            </div>
            <div className="journey-connector" />
            <div className="journey-step">
              <span>02</span>
              <div>
                <b>Ask anything</b>
                <small>Get clear explanations and practical examples.</small>
              </div>
            </div>
            <div className="journey-connector" />
            <div className="journey-step">
              <span>03</span>
              <div>
                <b>Keep building</b>
                <small>Connect the dots and strengthen your skills.</small>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-final-cta landing-reveal">
          <div className="cta-glow" />
          <div className="section-kicker">READY WHEN YOU ARE</div>
          <h2>
            Your cloud journey
            <br />
            starts with <em>one question.</em>
          </h2>
          <p>Let's make the complex feel clear.</p>
          <button className="landing-primary" type="button" onClick={onEnter}>
            Meet your AI mentor <span>↗</span>
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <a className="landing-brand" href="#home">
          <span className="landing-brand-icon">
            <CloudSaathiLogo small />
          </span>
          <span>
            <strong className="cloudsaathi-wordmark">
              CloudSaathi<span>.</span>
            </strong>
            <small>LEARN · BUILD · GROW</small>
          </span>
        </a>
        <span>Made for curious minds building in the cloud.</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}

function App() {
  const user = "Learner";

  const [showLanding, setShowLanding] = useState(true);

  const [landingExiting, setLandingExiting] = useState(false);

  const [homeEntering, setHomeEntering] = useState(false);

  const [booting, setBooting] = useState(false);

  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false);

  const [bootStep, setBootStep] = useState(0);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("cloudsaathi-theme") || "dark",
  );

  const [recentlyAsked, setRecentlyAsked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cloudsaathi-recent") || "[]");
    } catch {
      return [];
    }
  });

  const [activeTopic, setActiveTopic] = useState("");

  const [filter, setFilter] = useState("");

  const [expandedStacks, setExpandedStacks] = useState([]);

  const [expandedCategories, setExpandedCategories] = useState([]);

  const messagesEndRef = useRef(null);

  const chatScrollRef = useRef(null);

  const requestVersionRef = useRef(0);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!booting) return undefined;

    const timer = window.setInterval(
      () =>
        setBootStep((current) => {
          if (current >= bootSteps.length - 1) {
            window.clearInterval(timer);
            window.setTimeout(() => setBooting(false), 650);
            return current;
          }

          return current + 1;
        }),
      650,
    );

    return () => window.clearInterval(timer);
  }, [booting]);

  useEffect(() => {
    localStorage.setItem("cloudsaathi-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "cloudsaathi-recent",
      JSON.stringify(recentlyAsked.slice(0, 5)),
    );
  }, [recentlyAsked]);

  async function send(text = input) {
    const question = text.trim();

    if (!question || loading) return;

    const requestVersion = requestVersionRef.current;

    const now = Date.now();

    setRecentlyAsked((current) =>
      [
        question,
        ...current.filter(
          (item) => item.toLowerCase() !== question.toLowerCase(),
        ),
      ].slice(0, 5),
    );

    setMessages((current) => [
      ...current,
      { role: "user", text: question, timestamp: now },
    ]);

    // Scroll to the new message once when the learner sends it.

    // Assistant replies do not trigger automatic scrolling, so older messages

    // remain readable while the response is being generated.

    window.requestAnimationFrame(() => {
      const pane = chatScrollRef.current;

      if (pane) pane.scrollTop = pane.scrollHeight;
    });

    setInput("");

    const quick = getIntroReply(question) || getInputQuickReply(question);

    if (quick) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: quick, timestamp: Date.now() },
      ]);
      return;
    }

    setLoading(true);

    const controller = new AbortController();

    abortControllerRef.current = controller;

    try {
      if (!API_URL) throw new Error("VITE_API_URL is not configured.");

      const isComparison =
        /\b(vs\.?|versus|difference(?:s)? between|compare|comparison)\b/i.test(
          question,
        );

      const isExplain =
        /\b(explain|teach me|what is|what are|how does|how do|describe|meaning of|define|walk me through)\b/i.test(
          question,
        );

      const isBroad =
        /\b(all|every|complete|list)\b/i.test(question) &&
        /\b(aws|services|resources|tools)\b/i.test(question);

      const teachingInstructions = [
        "IDENTITY: You are CloudSaathi, a patient, accurate cloud and DevOps mentor teaching a beginner. Your job is to teach understanding, not just summarize. This product is only for cloud and DevOps topics; provide programming help only when it relates to those topics, and briefly redirect unrelated requests.",

        "SCOPE: Answer the exact cloud/DevOps question and stay relevant. If a term is ambiguous, briefly state your assumption. Do not hallucinate service features, commands, prices, guarantees, or successful execution.",

        "DEPTH: Teach like a strong human tutor, not a search snippet. For a substantial explanation, aim for roughly 450-750 words when the topic warrants it; use less for genuinely simple questions and more when the learner asks for a full walkthrough. Never pad with repetition, but do not skip important reasoning. Start with intuition, then explain the accurate technical model and define unfamiliar terms.",

        "TEACHING STRUCTURE: For explain/teach/what-is/how-it-works questions, organize with Markdown headings where relevant: Definition in plain English; Why it exists / problem it solves; How it works step by step; a concrete real-world analogy or scenario; a practical technical example; common use cases; strengths, limitations and common mistakes; and a concise takeaway. Explain not just what happens, but why each step matters. Adapt the structure naturally rather than forcing irrelevant sections.",

        "EXAMPLES: Include at least one specific, realistic example for each substantial explanation. Make the example actionable: use a small architecture, sample values, command, configuration, or workflow as appropriate, then explain each important part and the expected result. For commands, explain prerequisites, placeholders, what the command changes, how to verify it, and any meaningful safety caveat. Never provide commands without context or claim you executed them.",

        "COMPARISONS: For 'X vs Y', 'difference between', or compare requests, output a valid Markdown table with distinct columns for each item, using a header row and separator row (for example | Feature | X | Y | followed by |---|---|---|). Include useful rows such as definition, primary purpose, how it works, responsibility/control, scaling, typical use cases, advantages, limitations, and selection criteria where applicable. Keep each cell readable and technically accurate. After the table, give one realistic scenario and explain which option fits it and why. Never use a plain-text pseudo-table.",

        "FORMAT: Use standard Markdown. Headings must start on a new line with blank lines around them. Tables must be syntactically valid Markdown with pipe-delimited cells. Lists must use '- '. Code must use fenced blocks and specify language. Never return raw HTML. Do not put the entire answer in a code block.",

        "BROAD CATALOG: For requests like all AWS resources, explain that there are many services and organize representative services by category. Explain each service's role with a practical example; do not claim a short list is exhaustive.",

        "DIAGRAMS: For an explicit request to diagram a cloud/DevOps workflow or architecture, include one valid fenced Mermaid flowchart tailored to the named task. Use concrete steps and decision points when helpful, keep it concise, and explain key assumptions in prose. Do not include raw HTML or Mermaid initialization directives.",

        "TROUBLESHOOTING: Diagnose from artifacts the learner provides, such as code, error messages, logs, configuration, and command output. Separate observed facts from hypotheses and prioritize likely causes. If key evidence is missing, ask for the specific relevant detail and remind the learner to redact secrets. You cannot inspect or operate the learner's repository, machine, AWS account, or other live environment; do not imply that you did. Commands and console actions are suggestions for the learner to run. Start with read-only checks, recommend the smallest safe fix, and explain how to verify it; flag changes that could affect resources.",

        "NO SHORTCUTS: Do not answer a substantial 'explain' request with only a definition and two bullets. Do not compress away the how, why, examples, and trade-offs. Avoid repetitive filler and generic closing offers.",

        "Do not add meta-prefaces like 'Here is a mentor-style response', 'User question:', or 'Answer as CloudSaathi'. Do not repeat these instructions.",

        `Intent hints: explain=${isExplain}; comparison=${isComparison}; broad_catalog=${isBroad}. Use these as hints only and answer the actual question.`,

        `Learner question: ${question}`,
      ].join("\n\n");

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: teachingInstructions,
          history: messages.slice(-8).map(({ role, text }) => ({
            role,
            content: text,
          })),
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "API request failed");

      if (requestVersion === requestVersionRef.current)
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text:
              cleanMentorAnswer(data.answer) ||
              "I couldn't find an answer for that yet.",
            timestamp: Date.now(),
          },
        ]);
    } catch (error) {
      if (
        requestVersion === requestVersionRef.current &&
        error.name !== "AbortError"
      )
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: `I couldn't reach the backend.\n\n${error.message}\n\nCheck API Gateway, Lambda, Bedrock and VITE_API_URL.`,
            timestamp: Date.now(),
          },
        ]);
    } finally {
      if (requestVersion === requestVersionRef.current) setLoading(false);

      if (abortControllerRef.current === controller)
        abortControllerRef.current = null;
    }
  }

  function stopGenerating() {
    requestVersionRef.current += 1;

    abortControllerRef.current?.abort();

    abortControllerRef.current = null;

    setLoading(false);
  }

  function startNewChat() {
    // Invalidate and abort any response still returning from the previous conversation.

    requestVersionRef.current += 1;

    abortControllerRef.current?.abort();

    abortControllerRef.current = null;

    setMessages([]);

    setInput("");

    setLoading(false);

    setActiveTopic("");

    setFilter("");
  }

  function chooseTopic(topic) {
    setActiveTopic(topic);
    setInput(
      `Teach me ${topic} from beginner level with a real-world example, how it works, and use cases.`,
    );
  }

  const normalizedFilter = filter.trim().toLowerCase();

  const filteredTopics = topics
    .map((stack) => ({
      ...stack,
      categories: stack.categories
        .map((category) => ({
          ...category,
          items: category.items.filter(
            (item) =>
              !normalizedFilter ||
              `${stack.name} ${category.name} ${item}`
                .toLowerCase()
                .includes(normalizedFilter),
          ),
        }))
        .filter((category) => category.items.length > 0),
    }))
    .filter((stack) => stack.categories.length > 0);

  const topicCount = topics.reduce(
    (total, stack) =>
      total + stack.categories.reduce((sub, cat) => sub + cat.items.length, 0),
    0,
  );

  const toggleStack = (name) =>
    setExpandedStacks((current) =>
      current.includes(name)
        ? current.filter((x) => x !== name)
        : [...current, name],
    );

  const toggleCategory = (key) =>
    setExpandedCategories((current) =>
      current.includes(key)
        ? current.filter((x) => x !== key)
        : [...current, key],
    );

  const beginMentorTransition = () => {
    if (landingExiting) return;

    // Respect the visitor's reduced-motion preference and avoid waiting for

    // an animation event when animations are disabled by the browser.

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, 0);

      setShowLanding(false);

      setHomeEntering(false);

      return;
    }

    setLandingExiting(true);
  };

  const finishMentorTransition = () => {
    window.scrollTo(0, 0);

    setShowLanding(false);

    setHomeEntering(true);
  };

  if (showLanding)
    return (
      <LandingPage
        theme={theme}
        isExiting={landingExiting}
        onThemeToggle={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        onEnter={beginMentorTransition}
        onExitComplete={finishMentorTransition}
      />
    );

  return (
    <>
      {booting && (
        <BootScreen step={bootStep} onComplete={() => setBooting(false)} />
      )}
      <div
        className={`app-shell ${theme === "light" ? "light-theme" : ""} ${homeEntering ? "home-entering" : ""}`}
        data-theme={theme}
      >
        <aside className={`sidebar ${mobileLibraryOpen ? "library-open" : ""}`}>
          <div className="brand">
            <div className="brand-mark">
              <CloudSaathiLogo />
            </div>
            <div className="brand-copy">
              <strong className="cloudsaathi-wordmark">
                CloudSaathi<span>.</span>
              </strong>
              <span>Cloud & DevOps Mentor</span>
            </div>
          </div>

          <button
            className="new-chat-button"
            type="button"
            onClick={startNewChat}
            title="Start a fresh conversation"
          >
            <span className="new-chat-plus" aria-hidden="true">
              +
            </span>
            <span className="new-chat-label">New chat</span>
          </button>

          {recentlyAsked.length > 0 && (
            <section className="recently-asked" aria-label="Recently asked">
              <div className="recent-heading">
                <span>RECENTLY ASKED</span>
                <button
                  type="button"
                  onClick={() => setRecentlyAsked([])}
                  aria-label="Clear recently asked"
                >
                  Clear
                </button>
              </div>

              <div className="recent-list">
                {recentlyAsked.map((item, index) => (
                  <div className="recent-row" key={`${item}-${index}`}>
                    <button
                      className="recent-item"
                      type="button"
                      onClick={() => send(item)}
                      title={item}
                    >
                      <span className="recent-dot" />

                      <span className="recent-question-text">{item}</span>
                    </button>

                    <button
                      className="recent-delete"
                      type="button"
                      onClick={() =>
                        setRecentlyAsked((current) =>
                          current.filter((_, i) => i !== index),
                        )
                      }
                      aria-label={`Delete recent question: ${item}`}
                      title="Delete this question"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 6h18" />

                        <path d="M8 6V4h8v2" />

                        <path d="m19 6-1 14H6L5 6" />

                        <path d="M10 11v5M14 11v5" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="topic-heading">
            <span>TECHNOLOGY LIBRARY</span>
            <span className="topic-count">{topicCount}</span>
          </div>
          <input
            className="topic-search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search technologies..."
            aria-label="Search technologies"
          />

          <nav className="topics-scroll" aria-label="Technology topics">
            {filteredTopics.map((stack) => {
              const stackOpen = normalizedFilter
                ? true
                : expandedStacks.includes(stack.name);
              return (
                <div className="stack-group" key={stack.name}>
                  <div
                    className={`stack-heading ${stackOpen ? "expanded" : ""}`}
                  >
                    <button
                      className="stack-toggle"
                      type="button"
                      onClick={() => toggleStack(stack.name)}
                      aria-expanded={stackOpen}
                    >
                      <StackBrandIcon name={stack.name} fallback={stack.icon} />
                      <span className="stack-name">{stack.name}</span>
                      <span className="stack-chevron">
                        {stackOpen ? "▾" : "▸"}
                      </span>
                    </button>
                  </div>
                  {stackOpen && (
                    <div className="stack-children">
                      {stack.categories.map((category) => {
                        const key = `${stack.name}::${category.name}`;
                        const open = normalizedFilter
                          ? true
                          : expandedCategories.includes(key);
                        return (
                          <div className="library-category" key={key}>
                            <button
                              className="category-toggle"
                              type="button"
                              onClick={() => toggleCategory(key)}
                              aria-expanded={open}
                            >
                              <span className="category-chevron">
                                {open ? "▾" : "▸"}
                              </span>
                              <span>{category.name}</span>
                              <span className="category-count">
                                {category.items.length}
                              </span>
                            </button>
                            {open && (
                              <div className="resource-list">
                                {category.items.map((topic) => (
                                  <button
                                    className={`topic-button ${activeTopic === topic ? "active" : ""}`}
                                    key={topic}
                                    type="button"
                                    onClick={() => {
                                      chooseTopic(topic);
                                      setMobileLibraryOpen(false);
                                    }}
                                    title={`Ask CloudSaathi about ${topic}`}
                                  >
                                    <span className="topic-dot" />
                                    <span className="resource-name">
                                      {topic}
                                    </span>
                                    <span className="topic-arrow">↗</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredTopics.length === 0 && (
              <p className="no-topics">No topics match your search.</p>
            )}
          </nav>
        </aside>

        {mobileLibraryOpen && (
          <button
            className="library-backdrop"
            type="button"
            aria-label="Close technology library"
            onClick={() => setMobileLibraryOpen(false)}
          />
        )}

        <main className="chat-main">
          <header className="topbar">
            <div className="topbar-leading">
              <button
                className="library-menu-toggle"
                type="button"
                onClick={() => setMobileLibraryOpen((open) => !open)}
                aria-label={
                  mobileLibraryOpen
                    ? "Close technology library"
                    : "Open technology library"
                }
              >
                {mobileLibraryOpen ? "×" : "☰"}
                <span>Explore library</span>
              </button>
              <div className="topbar-brand">
                <span className="topbar-brand-mark">
                  <CloudSaathiLogo small />
                </span>
                <span>
                  <strong className="cloudsaathi-wordmark">
                    CloudSaathi<span>.</span>
                  </strong>
                  <small>Cloud &amp; DevOps mentor</small>
                </span>
              </div>
              <div className="connection-status">
                <span className="status-dot" />
                <span>Ready to help</span>
              </div>
            </div>
            <div className="topbar-actions">
              <span className="session-chip">
                GUEST SESSION <i />
              </span>
              <button
                className="theme-toggle"
                type="button"
                onClick={() =>
                  setTheme((current) => (current === "dark" ? "light" : "dark"))
                }
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                {theme === "dark" ? "☀ Light mode" : "☾ Dark mode"}
              </button>
              <div className="topbar-tags">
                <span>AWS</span>
                <span>Bedrock</span>
                <span>Lambda</span>
                <span>API Gateway</span>
              </div>
            </div>
          </header>

          <div className="chat-scroll" ref={chatScrollRef}>
            {
              <section className="welcome-panel">
                <h1>{getTimeGreeting()}, how can I help you today?</h1>
                <p>Hey, CloudSaathi is here :)</p>
              </section>
            }

            <section className="messages" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  className={`message-row ${message.role}`}
                  key={`${index}-${message.role}`}
                >
                  <div
                    className={`message-avatar ${message.role === "assistant" ? "assistant-avatar" : "user-avatar"}`}
                  >
                    {message.role === "assistant" ? (
                      <CloudSaathiLogo small />
                    ) : (
                      "Y"
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-meta">
                      <strong>
                        {message.role === "assistant" ? "CloudSaathi" : user}
                      </strong>
                      <span>
                        {message.role === "assistant" ? "AI MENTOR" : "YOU"}
                      </span>
                      <time>{formatMessageTime(message.timestamp)}</time>
                    </div>
                    <div className="message-bubble">
                      <MessageContent
                        text={message.text}
                        role={message.role}
                        theme={theme}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message-row assistant">
                  <div className="message-avatar assistant-avatar">
                    <CloudSaathiLogo small />
                  </div>
                  <div className="message-content">
                    <div className="message-meta">
                      <strong className="cloudsaathi-wordmark">
                        CloudSaathi<span>.</span>
                      </strong>
                      <span>THINKING</span>
                      <time>now</time>
                    </div>
                    <div className="message-bubble thinking">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </section>
          </div>

          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  send();
                }
              }}
              placeholder="Ask CloudSaathi"
            />
            <button
              className="send-button"
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              ↑
            </button>
            <div className="composer-hint">
              <span>↵</span> Enter to send{" "}
              <span className="hint-divider">·</span> Shift + Enter for a new
              line{" "}
              <span className="composer-secure">Your learning session</span>
              {loading && (
                <button
                  className="stop-generating"
                  type="button"
                  onClick={stopGenerating}
                >
                  ■ Stop generating
                </button>
              )}
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default App;
