import { useEffect, useRef, useState } from "react";



function CloudSaathiLogo({ small = false }) {
  return <svg className={`cloudsaathi-logo ${small ? "small" : ""}`} viewBox="0 0 48 48" role="img" aria-label="CloudSaathi logo">
    <defs><linearGradient id="csLogoGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#72e0ff"/><stop offset="55%" stopColor="#28a9ee"/><stop offset="100%" stopColor="#0877c9"/></linearGradient></defs>
    <path d="M24 3.5 42 13.8v20.4L24 44.5 6 34.2V13.8Z" fill="url(#csLogoGradient)" opacity=".98"/>
    <path d="M24 10.5 35.5 17v14L24 37.5 12.5 31V17Z" fill="#07182e" opacity=".95"/>
    <path d="M14.2 25.6c0-4 3-7 6.8-7 1.3-3.2 5.7-4.2 8.2-1.8 2.3.1 4.3 2 4.3 4.4 0 2.6-2.1 4.7-4.7 4.7H19" fill="none" stroke="#72e0ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="30.5" r="1.7" fill="#72e0ff"/>
  </svg>;
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

  if (/^(hi+|hello+|hey+|hii+|good morning|good afternoon|good evening|how are you|haow are u |thanks|thank you|ok+|okay+)[!.\s😊👋]*$/iu.test(value)) {

    if (/^(hi+|hello+|hey+|hii+)/i.test(value)) return "Hello!👋 What cloud or DevOps topic can I help you learn?";

    if (/^good morning/i.test(value)) return "Good morning! ☀️ What would you like to learn today?";

    if (/^good afternoon/i.test(value)) return "Good afternoon! What cloud or DevOps question can I help with?";

    if (/^good evening/i.test(value)) return "Good evening! What would you like to explore?";

    if (/^how are you/i.test(value)) return "I'm ready to help! What cloud or DevOps question do you have?";

    return "You're welcome! 😊 Ask whenever you're ready to learn.";

  }

  if (!/[a-z0-9]/i.test(value) || /^[\W_]+$/.test(value)) {

    return "I couldn't identify a question. Please ask about AWS, cloud computing, DevOps, DevSecOps,  CI/CD, Linux, containers, infrastructure, or security.";

  }

  return null;

}



function cleanMentorAnswer(answer) {

  return String(answer || "")

    .replace(/^\s*(?:Certainly!?\s*)?(?:Here(?:'s| is) a mentor-style response to your question:?|User question:.*|Answer as CloudSaathi:?)/gim, "")

    .replace(/^\s*(?:As CloudSaathi,?\s*)?(?:the answer is:?)/gim, "")

    .replace(/\n{3,}/g, "\n\n")

    .trim();

}



function getIntroReply(question) {

  const q = question.toLowerCase().trim().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ");

  if (/\b(who are you|who r u|who r you|what are you|introduce yourself|tell me about yourself|about you|about cloudsaathi|who built you|who built u|who created you|who created u|who made you|who made u|who developed you|who developed u|who is your creator|who is your developer|who owns you)\b/.test(q)) {

    return "I'm CloudSaathi, a cloud and DevOps AI mentor created by Asish Sarangi as a learning project. I help explain concepts, plan architectures, troubleshoot deployments, and provide practical examples.";

  }

  if (/\b(what can you do|how can you help|how do you help|what do you help with|your capabilities|what can i ask|how to use you)\b/.test(q)) {

    return "I can teach cloud and DevOps concepts step by step, compare technologies, plan architectures, explain commands, and troubleshoot errors. Ask a specific question and we'll work through it together.";

  }

  return null;

}



const topics = [

  { name: "AWS", icon: "☁", categories: [

    { name: "Compute", items: ["EC2", "Auto Scaling", "Elastic Load Balancing (ALB/NLB)", "Lambda", "Elastic Beanstalk", "AWS Batch", "Lightsail", "App Runner", "ECS", "EKS", "Fargate", "Outposts"] },

    { name: "Storage", items: ["S3", "S3 Glacier", "EBS", "EFS", "FSx", "Storage Gateway", "AWS Backup", "DataSync", "Transfer Family"] },

    { name: "Networking & CDN", items: ["VPC", "Subnets", "Route Tables", "Internet Gateway", "NAT Gateway", "Security Groups", "Network ACLs", "Route 53", "CloudFront", "Direct Connect", "Site-to-Site VPN", "Transit Gateway", "PrivateLink", "Global Accelerator", "AWS WAF", "AWS Shield"] },

    { name: "Identity & Security", items: ["IAM", "IAM Identity Center", "Organizations", "Control Tower", "KMS", "Secrets Manager", "Systems Manager Parameter Store", "Certificate Manager (ACM)", "Cognito", "GuardDuty", "Inspector", "Security Hub", "Macie", "Detective", "CloudHSM", "Artifact"] },

    { name: "Databases", items: ["RDS", "Aurora", "DynamoDB", "ElastiCache", "DocumentDB", "Neptune", "Redshift", "Keyspaces", "MemoryDB", "Timestream", "QLDB"] },

    { name: "AI & Machine Learning", items: ["Amazon Bedrock", "SageMaker AI", "Rekognition", "Textract", "Comprehend", "Lex", "Polly", "Transcribe", "Translate", "Kendra", "Personalize", "Q Developer"] },

    { name: "Data Analytics & Streaming", items: ["Athena", "Glue", "Lake Formation", "EMR", "OpenSearch Service", "Kinesis Data Streams", "Kinesis Data Firehose", "Managed Service for Apache Flink", "QuickSight", "DataZone", "MSK (Managed Kafka)"] },

    { name: "Application Integration", items: ["API Gateway", "SQS", "SNS", "EventBridge", "Step Functions", "Amazon MQ", "AppFlow", "AppSync"] },

    { name: "Developer Tools & CI/CD", items: ["CodeBuild", "CodeDeploy", "CodePipeline", "CodeArtifact", "CloudShell", "X-Ray", "Cloud Development Kit (CDK)"] },

    { name: "Management & Governance", items: ["CloudWatch", "CloudTrail", "AWS Config", "Trusted Advisor", "Systems Manager", "Service Catalog", "CloudFormation", "AWS Health Dashboard", "Compute Optimizer", "Cost Explorer", "Budgets", "Pricing Calculator", "Well-Architected Tool"] }

  ]},

  { name: "Docker", icon: "▣", categories: [

    { name: "Core Concepts", items: ["Images", "Containers", "Docker Engine", "Dockerfile", "Docker CLI", "Docker Hub", "Registries", "Volumes", "Bind Mounts", "Docker Networks", "Container Lifecycle"] },

    { name: "Build & Compose", items: ["Multi-stage Builds", "BuildKit", "Docker Compose", "Environment Variables", "Health Checks", "Secrets in Compose"] },

    { name: "Security & Operations", items: ["Non-root Containers", "Image Scanning", "Image Tagging", "Resource Limits", "Logging Drivers", "Troubleshooting Containers"] }

  ]},

  { name: "Kubernetes", icon: "⎈", categories: [

    { name: "Architecture & Workloads", items: ["Cluster Architecture", "Control Plane", "Nodes", "Pods", "ReplicaSets", "Deployments", "StatefulSets", "DaemonSets", "Jobs & CronJobs", "Namespaces", "Labels & Selectors"] },

    { name: "Networking & Traffic", items: ["Services", "ClusterIP", "NodePort", "LoadBalancer Service", "Ingress", "Ingress Controllers", "Network Policies", "CoreDNS", "Service Mesh"] },

    { name: "Configuration & Storage", items: ["ConfigMaps", "Secrets", "PersistentVolumes", "PersistentVolumeClaims", "StorageClasses", "Probes"] },

    { name: "Security & Access", items: ["RBAC", "Service Accounts", "Pod Security Standards", "Security Context", "Sealed Secrets", "External Secrets"] },

    { name: "Scaling & Operations", items: ["HPA", "VPA", "Cluster Autoscaler", "Requests & Limits", "Rolling Updates", "Helm", "Kustomize", "kubectl", "Troubleshooting", "EKS"] }

  ]},

  { name: "Terraform", icon: "⌘", categories: [

    { name: "Core & Language", items: ["Providers", "Resources", "Data Sources", "Variables", "Outputs", "Locals", "Expressions & Functions", "For Each & Count"] },

    { name: "State & Modules", items: ["Terraform State", "Remote State", "State Locking", "Import", "Modules", "Workspaces"] },

    { name: "Workflow & Quality", items: ["init", "fmt", "validate", "plan", "apply", "destroy", "Lifecycle Meta-Arguments", "TFLint", "tfsec", "Checkov"] },

    { name: "AWS Infrastructure Patterns", items: ["VPC with Terraform", "EC2 with Terraform", "S3 with Terraform", "ALB & ASG", "IAM Policies", "EKS with Terraform"] }

  ]},

  { name: "Jenkins", icon: "♾", categories: [{name:"Pipeline Fundamentals",items:["Jenkins Architecture","Controller & Agents","Pipeline Jobs","Declarative Pipeline","Scripted Pipeline","Jenkinsfile","Stages & Steps","Parameters"]},{name:"Integrations & Delivery",items:["GitHub Webhooks","SCM Checkout","Credentials Store","Docker Builds","Kubernetes Agents","Artifact Publishing","Deployment Pipelines"]}]},

  { name: "Git & GitHub", icon: "⑂", categories: [{name:"Git Basics",items:["Repositories","clone","status","add & commit","branch & switch","merge","rebase","stash","reset & revert","tags"]},{name:"GitHub Collaboration",items:["Pull Requests","Code Reviews","Branch Protection","GitHub Actions","GitHub Secrets","Environments","GitHub Releases"]}]},

  { name: "CI/CD & GitOps", icon: "⇄", categories: [{name:"Pipelines",items:["CI vs CD","Build-Test-Deploy Workflow","GitHub Actions","GitLab CI/CD","Azure Pipelines","AWS CodePipeline","Build Artifacts","Deployment Strategies"]},{name:"Release Strategies",items:["Rolling Deployment","Blue-Green Deployment","Canary Deployment","Rollback Strategy","GitOps Principles","Argo CD","Flux CD"]}]},

  { name: "Linux & Shell", icon: "⌁", categories: [{name:"System Fundamentals",items:["Linux Filesystem","Users & Groups","Permissions","Processes","systemd & Services","Package Managers","Environment Variables","SSH","Cron Jobs"]},{name:"Networking & Troubleshooting",items:["grep, awk & sed","curl & wget","DNS Tools","Ports & Sockets","Disk & Memory","Logs & journalctl","Bash Scripting","Exit Codes"]}]},

  { name: "Ansible", icon: "✣", categories: [{name:"Automation Basics",items:["Inventory","Ad-hoc Commands","Playbooks","Tasks & Handlers","Variables","Facts","Templates","Conditionals & Loops"]},{name:"Reusable Automation",items:["Roles","Collections","Ansible Galaxy","Vault","Dynamic Inventory","Configuration Management","Idempotency"]}]},

  { name: "Monitoring & Observability", icon: "◉", categories: [{name:"Metrics & Dashboards",items:["Prometheus","Grafana","Alertmanager","CloudWatch Metrics","Dashboards","SLI / SLO / SLA"]},{name:"Logs & Traces",items:["ELK / Elastic Stack","OpenSearch Dashboards","Fluent Bit","Loki","Jaeger","OpenTelemetry","Distributed Tracing"]}]},

  { name: "DevSecOps", icon: "⬡", categories: [{name:"Code & Dependency Security",items:["SAST vs DAST","SonarQube","Semgrep","Dependency Scanning","OWASP Top 10","Secret Scanning","Software Composition Analysis"]},{name:"Container & IaC Security",items:["Trivy","Snyk","tfsec","Checkov","Container Image Hardening","SBOM","Image Signing","Policy as Code"]},{name:"Secrets & Cloud Security",items:["Least Privilege","Secrets Management","Kubernetes Sealed Secrets","HashiCorp Vault","IAM Best Practices","Threat Modeling","Incident Response"]}]}

];



const starters = [
  { text: "Explain AWS EC2 and when to use it" },
  { text: "Design a secure AWS three-tier architecture" },
  { text: "Compare Docker and Kubernetes" },
  { text: "Build a GitHub Actions CI/CD pipeline" }
];

function formatMessageTime(value) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value || Date.now()));
}



function renderInline(text) {
  const tokens = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((token, index) => {
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code className="inline-code" key={index}>{token.slice(1, -1)}</code>;
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
    line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());

  const isSeparator = (line) =>
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());

  const rows = tableLines.filter((line) => !isSeparator(line)).map(parseRow);
  if (rows.length < 2) return null;

  const headers = rows[0];
  const bodyRows = rows.slice(1);
  return (
    <div className="table-scroll" key={key}>
      <table className="answer-table">
        <thead><tr>{headers.map((cell, i) => <th key={i}>{renderInline(cell)}</th>)}</tr></thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri}>
              {headers.map((_, ci) => <td key={ci}>{renderInline(row[ci] || "")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function MarkdownContent({ text }) {

  const blocks = String(text || "").replace(/\r\n/g, "\n").split(/\n{2,}/);

  return <div className="formatted-answer">

    {blocks.map((block, index) => {

      const trimmed = block.trim();

      if (!trimmed) return null;

      const lines = trimmed.split("\n");

      if (lines.some(line => line.trim().startsWith("|")) && lines.filter(line => line.trim().startsWith("|")).length >= 2) {

        const table = renderMarkdownTable(lines, `table-${index}`);

        if (table) return table;

      }

      if (trimmed.startsWith("```")) {

        const match = trimmed.match(/^```([^\n]*)\n([\s\S]*?)\n?```$/);

        if (match) return <div className="code-card" key={index}><div className="code-card-header"><span>{match[1] || "CODE"}</span><button type="button" onClick={() => navigator.clipboard?.writeText(match[2])}>Copy code</button></div><pre><code>{match[2]}</code></pre></div>;

      }

      if (/^#{1,4}\s/.test(lines[0])) {

        const level = Math.min(4, lines[0].match(/^#+/)[0].length);

        const heading = lines[0].replace(/^#{1,4}\s+/, "");

        const rest = lines.slice(1);

        const Tag = `h${level + 2}`;

        return <section className="answer-section" key={index}><Tag className="answer-heading">{renderInline(heading)}</Tag>{rest.length > 0 && <MarkdownContent text={rest.join("\n")} />}</section>;

      }

      if (lines.every(line => /^\s*[-*]\s+/.test(line))) return <ul className="answer-list" key={index}>{lines.map((line, i) => <li key={i}>{renderInline(line.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul>;

      if (lines.every(line => /^\s*\d+[.)]\s+/.test(line))) return <ol className="answer-list numbered" key={index}>{lines.map((line, i) => <li key={i}>{renderInline(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>)}</ol>;

      return <p className="answer-paragraph" key={index}>{lines.map((line, i) => <span key={i}>{renderInline(line)}{i < lines.length - 1 && <br />}</span>)}</p>;

    })}

  </div>;

}



function MessageContent({ text, role }) {

  return role === "assistant" ? <MarkdownContent text={text} /> : <>{text}</>;

}



const bootSteps = [

  { status: "INIT", text: "Starting CloudSaathi runtime" },
  { status: "LOAD", text: "Loading cloud and DevOps learning library" },
  { status: "INIT", text: "Preparing chat interface and Markdown renderer" },
  { status: "CHECK", text: "Chat API will be contacted when you send a message" },
  { status: "READY", text: "Frontend startup sequence complete" }

];



function BootScreen({ onComplete, step }) {

  const visibleSteps = bootSteps.slice(0, step + 1);

  const progress = Math.min(100, Math.round((step / (bootSteps.length - 1)) * 100));

  return <div className="boot-screen" role="status" aria-live="polite"><div className="boot-window">

    <div className="boot-titlebar"><div className="boot-lights"><i/><i/><i/></div><span>cloudsaathi — startup console</span><span className="boot-version">v1.0</span></div>

    <div className="boot-brand"><div className="boot-logo"><CloudSaathiLogo /></div><div><h1>CloudSaathi</h1><p>Cloud &amp; DevOps Mentor</p></div></div>

    <div className="boot-terminal"><div className="boot-command"><span>$</span> cloudsaathi --initialize</div>{visibleSteps.map((line,index)=><div className={`boot-line ${line.status==="READY"?"is-ready":""}`} key={line.text}><span className="boot-time">[{String(index+1).padStart(2,"0")}]</span><span className="boot-status">{line.status}</span><span className="boot-line-text">{line.text}</span></div>)}{step<bootSteps.length-1&&<div className="boot-cursor-line"><span className="boot-cursor"/> executing startup tasks...</div>}</div>

    <div className="boot-progress-meta"><span>{step===bootSteps.length-1?"SYSTEM READY":"INITIALIZING SYSTEM"}</span><span>{progress}%</span></div><div className="boot-progress"><div style={{width:`${progress}%`}}/></div><div className="boot-footer"><span><i/> Frontend initialized locally</span><button type="button" onClick={onComplete}>Skip intro ↗</button></div>

  </div></div>;

}



function App() {

  const user = "Learner";

  const [booting, setBooting] = useState(true);

  const [bootStep, setBootStep] = useState(0);

  const createWelcomeMessage = () => ({role:"assistant",text:`${getTimeGreeting()}. I'm CloudSaathi, an AI assistant focused on cloud computing and DevOps. I can help you understand AWS services, design cloud architectures, troubleshoot deployment issues, and work through practical examples. What would you like to work on?`, timestamp: Date.now()});

  const [messages, setMessages] = useState(() => [createWelcomeMessage()]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("cloudsaathi-theme") || "dark");
  const [recentlyAsked, setRecentlyAsked] = useState(() => { try { return JSON.parse(localStorage.getItem("cloudsaathi-recent") || "[]"); } catch { return []; } });

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

    const timer = window.setInterval(() => setBootStep(current => {

      if (current >= bootSteps.length - 1) { window.clearInterval(timer); window.setTimeout(() => setBooting(false), 650); return current; }

      return current + 1;

    }), 650);

    return () => window.clearInterval(timer);

  }, [booting]);

  useEffect(() => {
    localStorage.setItem("cloudsaathi-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cloudsaathi-recent", JSON.stringify(recentlyAsked.slice(0, 5)));
  }, [recentlyAsked]);

  useEffect(() => {
    // Scroll only the conversation pane after a message is added. scrollIntoView()
    // can scroll the page and move the welcome panel on initial render/refresh.
    if (messages.length <= 1 && !loading) return;
    const pane = chatScrollRef.current;
    if (!pane) return;
    pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);



  async function send(text = input) {

    const question = text.trim();

    if (!question || loading) return;

    const requestVersion = requestVersionRef.current;
    const now = Date.now();
    setRecentlyAsked(current => [question, ...current.filter(item => item.toLowerCase() !== question.toLowerCase())].slice(0, 5));
    setMessages(current => [...current,{role:"user",text:question,timestamp:now}]);

    setInput("");

    const quick = getIntroReply(question) || getInputQuickReply(question);

    if (quick) { setMessages(current => [...current,{role:"assistant",text:quick,timestamp:Date.now()}]); return; }

    setLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {

      if (!API_URL) throw new Error("VITE_API_URL is not configured.");

      const isComparison = /\b(vs\.?|versus|difference(?:s)? between|compare|comparison)\b/i.test(question);

      const isExplain = /\b(explain|teach me|what is|what are|how does|how do|describe|meaning of|define|walk me through)\b/i.test(question);

      const isBroad = /\b(all|every|complete|list)\b/i.test(question) && /\b(aws|services|resources|tools)\b/i.test(question);

      const teachingInstructions = [

        "IDENTITY: You are CloudSaathi, a patient, accurate cloud and DevOps mentor teaching a beginner. Your job is to teach understanding, not just summarize.",

        "SCOPE: Answer the exact question and stay relevant. If a term is ambiguous, briefly state your assumption. Do not hallucinate service features, commands, prices, guarantees, or successful execution.",

        "DEPTH: Teach like a strong human tutor, not a search snippet. For a substantial explanation, aim for roughly 450-750 words when the topic warrants it; use less for genuinely simple questions and more when the learner asks for a full walkthrough. Never pad with repetition, but do not skip important reasoning. Start with intuition, then explain the accurate technical model and define unfamiliar terms.",

        "TEACHING STRUCTURE: For explain/teach/what-is/how-it-works questions, organize with Markdown headings where relevant: Definition in plain English; Why it exists / problem it solves; How it works step by step; a concrete real-world analogy or scenario; a practical technical example; common use cases; strengths, limitations and common mistakes; and a concise takeaway. Explain not just what happens, but why each step matters. Adapt the structure naturally rather than forcing irrelevant sections.",

        "EXAMPLES: Include at least one specific, realistic example for each substantial explanation. Make the example actionable: use a small architecture, sample values, command, configuration, or workflow as appropriate, then explain each important part and the expected result. For commands, explain prerequisites, placeholders, what the command changes, how to verify it, and any meaningful safety caveat. Never provide commands without context or claim you executed them.",

        "COMPARISONS: For 'X vs Y', 'difference between', or compare requests, output a valid Markdown table with distinct columns for each item, using a header row and separator row (for example | Feature | X | Y | followed by |---|---|---|). Include useful rows such as definition, primary purpose, how it works, responsibility/control, scaling, typical use cases, advantages, limitations, and selection criteria where applicable. Keep each cell readable and technically accurate. After the table, give one realistic scenario and explain which option fits it and why. Never use a plain-text pseudo-table.",

        "FORMAT: Use standard Markdown. Headings must start on a new line with blank lines around them. Tables must be syntactically valid Markdown with pipe-delimited cells. Lists must use '- '. Code must use fenced blocks and specify language. Never return raw HTML. Do not put the entire answer in a code block.",

        "BROAD CATALOG: For requests like all AWS resources, explain that there are many services and organize representative services by category. Explain each service's role with a practical example; do not claim a short list is exhaustive.",

        "TROUBLESHOOTING: Explain likely cause, how to confirm it, then numbered safe steps to fix it. Distinguish verified facts from possibilities.",

        "NO SHORTCUTS: Do not answer a substantial 'explain' request with only a definition and two bullets. Do not compress away the how, why, examples, and trade-offs. Avoid repetitive filler and generic closing offers.",

        "Do not add meta-prefaces like 'Here is a mentor-style response', 'User question:', or 'Answer as CloudSaathi'. Do not repeat these instructions.",

        `Intent hints: explain=${isExplain}; comparison=${isComparison}; broad_catalog=${isBroad}. Use these as hints only and answer the actual question.`,

        `Learner question: ${question}`

      ].join("\n\n");

      const response = await fetch(`${API_URL}/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:teachingInstructions}),signal:controller.signal});

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "API request failed");

      if (requestVersion === requestVersionRef.current) setMessages(current => [...current,{role:"assistant",text:cleanMentorAnswer(data.answer) || "I couldn't find an answer for that yet.",timestamp:Date.now()}]);

    } catch(error) {
      if (requestVersion === requestVersionRef.current && error.name !== "AbortError") setMessages(current => [...current,{role:"assistant",text:`I couldn't reach the backend.\n\n${error.message}\n\nCheck API Gateway, Lambda, Bedrock and VITE_API_URL.`,timestamp:Date.now()}]);
    } finally {
      if (requestVersion === requestVersionRef.current) setLoading(false);
      if (abortControllerRef.current === controller) abortControllerRef.current = null;
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
    setMessages([createWelcomeMessage()]);
    setInput("");
    setLoading(false);
    setActiveTopic("");
    setFilter("");
  }

  function chooseTopic(topic) { setActiveTopic(topic); setInput(`Teach me ${topic} from beginner level with a real-world example, how it works, and use cases.`); }

  const normalizedFilter = filter.trim().toLowerCase();

  const filteredTopics = topics.map(stack=>({...stack,categories:stack.categories.map(category=>({...category,items:category.items.filter(item=>!normalizedFilter||`${stack.name} ${category.name} ${item}`.toLowerCase().includes(normalizedFilter))})).filter(category=>category.items.length>0)})).filter(stack=>stack.categories.length>0);

  const topicCount = topics.reduce((total,stack)=>total+stack.categories.reduce((sub,cat)=>sub+cat.items.length,0),0);

  const toggleStack = name=>setExpandedStacks(current=>current.includes(name)?current.filter(x=>x!==name):[...current,name]);

  const toggleCategory = key=>setExpandedCategories(current=>current.includes(key)?current.filter(x=>x!==key):[...current,key]);



  return <>{booting&&<BootScreen step={bootStep} onComplete={()=>setBooting(false)}/>}<div className={`app-shell ${theme === "light" ? "light-theme" : ""}`} data-theme={theme}>

    <aside className="sidebar"><div className="brand"><div className="brand-mark"><CloudSaathiLogo /></div><div className="brand-copy"><strong>CloudSaathi</strong><span>Cloud & DevOps Mentor</span></div></div>

      <button className="new-chat-button" type="button" onClick={startNewChat} title="Start a fresh conversation"><span className="new-chat-plus" aria-hidden="true">+</span><span className="new-chat-label">New chat</span></button>

      {recentlyAsked.length > 0 && <section className="recently-asked" aria-label="Recently asked"><div className="recent-heading"><span>RECENTLY ASKED</span><button type="button" onClick={() => setRecentlyAsked([])} aria-label="Clear recently asked">Clear</button></div><div className="recent-list">{recentlyAsked.map((item,index)=><button className="recent-item" type="button" key={`${item}-${index}`} onClick={() => send(item)} title={item}><span className="recent-dot"/><span>{item}</span></button>)}</div></section>}


      <div className="topic-heading"><span>TECHNOLOGY LIBRARY</span><span className="topic-count">{topicCount}</span></div><input className="topic-search" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search technologies..." aria-label="Search technologies"/>

      <nav className="topics-scroll" aria-label="Technology topics">{filteredTopics.map(stack=>{const stackOpen=normalizedFilter?true:expandedStacks.includes(stack.name);return <div className="stack-group" key={stack.name}><div className={`stack-heading ${stackOpen?"expanded":""}`}><button className="stack-toggle" type="button" onClick={()=>toggleStack(stack.name)} aria-expanded={stackOpen}><span className="stack-icon">{stack.icon}</span><span className="stack-name">{stack.name}</span><span className="stack-chevron">{stackOpen?"▾":"▸"}</span></button></div>{stackOpen&&<div className="stack-children">{stack.categories.map(category=>{const key=`${stack.name}::${category.name}`;const open=normalizedFilter?true:expandedCategories.includes(key);return <div className="library-category" key={key}><button className="category-toggle" type="button" onClick={()=>toggleCategory(key)} aria-expanded={open}><span className="category-chevron">{open?"▾":"▸"}</span><span>{category.name}</span><span className="category-count">{category.items.length}</span></button>{open&&<div className="resource-list">{category.items.map(topic=><button className={`topic-button ${activeTopic===topic?"active":""}`} key={topic} type="button" onClick={()=>chooseTopic(topic)} title={`Ask CloudSaathi about ${topic}`}><span className="topic-dot"/><span className="resource-name">{topic}</span><span className="topic-arrow">↗</span></button>)}</div>}</div>})}</div>}</div>})}{filteredTopics.length===0&&<p className="no-topics">No topics match your search.</p>}</nav>

    </aside>

    <main className="chat-main"><header className="topbar"><div className="connection-status"><span className="status-dot"/></div><div className="topbar-actions"><button className="theme-toggle" type="button" onClick={() => setTheme(current => current === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? "☀ Light mode" : "☾ Dark mode"}</button><div className="topbar-tags"><span>AWS</span><span>Bedrock</span><span>Lambda</span><span>API Gateway</span></div></div></header>

      <div className="chat-scroll" ref={chatScrollRef}><section className="welcome-panel"><div className="welcome-label"><span/> CLOUD LEARNING, SIMPLIFIED</div><div className="welcome-emblem"><CloudSaathiLogo /></div><h1>Your AI mentor for<br/><em>cloud &amp; DevOps.</em></h1><p>Understand concepts. Build architectures. Debug deployments.<br className="desktop-break"/> Learn step by step, at your own pace.</p><div className="starter-grid">{starters.map((starter,i)=><button className="starter-card" key={starter.text} onClick={()=>send(starter.text)}><span className="starter-number">0{i+1}</span><span>{starter.text}</span><b>↗</b></button>)}</div></section>

        <section className="messages" aria-live="polite">{messages.map((message,index)=><div className={`message-row ${message.role}`} key={`${index}-${message.role}`}><div className={`message-avatar ${message.role==="assistant"?"assistant-avatar":"user-avatar"}`}>{message.role==="assistant"?<CloudSaathiLogo small />:"Y"}</div><div className="message-content"><div className="message-meta"><strong>{message.role==="assistant"?"CloudSaathi":user}</strong><span>{message.role==="assistant"?"AI MENTOR":"YOU"}</span><time>{formatMessageTime(message.timestamp)}</time></div><div className="message-bubble"><MessageContent text={message.text} role={message.role}/></div></div></div>)}{loading&&<div className="message-row assistant"><div className="message-avatar assistant-avatar">☁</div><div className="message-content"><div className="message-meta"><strong>CloudSaathi</strong><span>THINKING</span><time>now</time></div><div className="message-bubble thinking"><i/><i/><i/></div></div></div>}<div ref={messagesEndRef}/></section>

      </div>

      <form className="composer" onSubmit={event=>{event.preventDefault();send();}}><textarea value={input} onChange={event=>setInput(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();send();}}} placeholder="Ask about EC2, VPC, CI/CD, Kubernetes, Terraform..." rows={1} aria-label="Ask CloudSaathi a question"/><button className="send-button" type="submit" disabled={!input.trim()||loading} aria-label="Send message">↑</button><div className="composer-hint"><span>↵</span> Enter to send <span className="hint-divider">·</span> Shift + Enter for a new line <span className="composer-secure">Your learning session</span>{loading && <button className="stop-generating" type="button" onClick={stopGenerating}>■ Stop generating</button>}</div></form>

    </main>

  </div></>;

}

export default App;
