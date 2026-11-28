import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { topics as libraryTopics } from "./data/libraryData.js";
import helmoraLogo from "./assets/logos/helmora.svg";
import awsLogo from "./assets/logos/aws.svg";
import dockerLogo from "./assets/logos/docker.svg";
import kubernetesLogo from "./assets/logos/kubernetes.svg";
import terraformLogo from "./assets/logos/terraform.svg";
import jenkinsLogo from "./assets/logos/jenkins.svg";
import githubLogo from "./assets/logos/github.svg";
import gitLogo from "./assets/logos/git.svg";
import githubActionsLogo from "./assets/logos/githubactions.svg";
import linuxLogo from "./assets/logos/linux.svg";
import ansibleLogo from "./assets/logos/ansible.svg";
import prometheusLogo from "./assets/logos/prometheus.svg";
import snykLogo from "./assets/logos/snyk.svg";
import gitlabLogo from "./assets/logos/gitlab.svg";
import grafanaLogo from "./assets/logos/grafana.svg";
import argocdLogo from "./assets/logos/argocd.svg";
function HelmoraLogo({ small = false }) {
  return (
    <img
      src={helmoraLogo}
      className={`helmora-logo ${small ? "small" : ""}`}
      alt="Helmora"
      aria-label="Helmora"
      draggable="false"
    />
  );
}

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
const MAX_ATTACHMENT_TEXT_CHARS = 30000;
const IMAGE_TYPES_BY_EXTENSION = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};
const TEXT_FILE_EXTENSIONS = new Set([
  "txt",
  "md",
  "csv",
  "json",
  "yaml",
  "yml",
  "log",
  "tf",
  "tfvars",
  "py",
  "sh",
  "xml",
  "conf",
  "ini",
  "properties",
]);

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

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
      /^\s\*(?:Certainly!?\s\*)?(?:Here(?:'s| is) a mentor-style response to your question:?|User question:.\*|Answer as (?:Helmora|CloudSaathi):?)/gim,
      "",
    )

    .replace(/^\s\*(?:As (?:Helmora|CloudSaathi),?\s\*)?(?:the answer is:?)/gim, "")

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
    /\b(who are you|who r u|who r you|what are you|introduce yourself|tell me about yourself|about you|about (?:helmora|cloudsaathi)|who built you|who built u|who created you|who created u|who made you|who made u|who developed you|who developed u|who is your creator|who is your developer|who owns you)\b/.test(
      q,
    )
  ) {
    return "I'm Helmora, an AI mentor for cloud and DevOps created by Asish Sarangi as a learning project. I help explain concepts, plan architectures, troubleshoot deployments, and provide practical examples.";
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
  "GitLab CI/CD": gitlabLogo,
  "Argo CD & GitOps": argocdLogo,
  "Grafana & Dashboards": grafanaLogo,
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

const topics = libraryTopics;;

function formatMessageTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value || Date.now()));
}

function formatConversationDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
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

async function copyTextToClipboard(value) {
  const text = String(value ?? "");
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.warn("Clipboard API unavailable; trying fallback.", error);
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch (error) {
    console.error("Unable to copy text.", error);
    return false;
  }
}

function MermaidDiagram({ source, theme }) {
  const renderId = `helmora-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [renderResult, setRenderResult] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const viewportRef = useRef(null);
  const closeButtonRef = useRef(null);
  const sourceTooLong = source.length > MAX_MERMAID_SOURCE_LENGTH;

  useEffect(() => {
    if (sourceTooLong) return undefined;
    let cancelled = false;

    async function renderDiagram() {
      try {
        const [{ default: mermaid }, { default: DOMPurify }] = await Promise.all([
          import("mermaid"),
          import("dompurify"),
        ]);

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          secure: ["securityLevel", "startOnLoad", "maxTextSize", "suppressErrorRendering", "maxEdges", "htmlLabels", "layout"],
          maxTextSize: MAX_MERMAID_SOURCE_LENGTH,
          suppressErrorRendering: true,
          maxEdges: 100,
          htmlLabels: false,
          layout: "dagre",
          theme: theme === "light" ? "default" : "dark",
          themeVariables: theme === "light"
            ? { fontFamily: "Inter, system-ui, sans-serif", fontSize: "15px", primaryColor: "#e8f4ff", primaryTextColor: "#14253b", primaryBorderColor: "#68a9d6", lineColor: "#5799c7", secondaryColor: "#eef7ff", tertiaryColor: "#f6faff" }
            : { fontFamily: "Inter, system-ui, sans-serif", fontSize: "15px", primaryColor: "#102b49", primaryTextColor: "#e8f4ff", primaryBorderColor: "#55c8ff", lineColor: "#65b8e8", secondaryColor: "#14243b", tertiaryColor: "#0c1b30" },
          flowchart: { curve: "basis", nodeSpacing: 38, rankSpacing: 48, padding: 14, htmlLabels: false, useMaxWidth: false },
        });

        const { svg } = await mermaid.render(renderId, stripMermaidStyleDirectives(source));
        const sanitizedSvg = DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          FORBID_TAGS: ["foreignObject"],
        });
        if (!sanitizedSvg) throw new Error("Mermaid returned an empty diagram.");
        if (!cancelled) setRenderResult({ source, theme, svg: sanitizedSvg, error: false });
      } catch (error) {
        console.error("Mermaid diagram rendering failed:", error);
        if (!cancelled) setRenderResult({ source, theme, svg: "", error: true });
      }
    }

    void renderDiagram();
    return () => { cancelled = true; };
  }, [renderId, source, sourceTooLong, theme]);

  useEffect(() => {
    if (!isExpanded) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setZoom(1);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsExpanded(false);
      if ((event.ctrlKey || event.metaKey) && (event.key === "+" || event.key === "=")) {
        event.preventDefault(); setZoom((value) => Math.min(3, Number((value + 0.2).toFixed(2))));
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "-") {
        event.preventDefault(); setZoom((value) => Math.max(0.4, Number((value - 0.2).toFixed(2))));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const result = renderResult?.source === source && renderResult.theme === theme ? renderResult : null;
  const hasError = sourceTooLong || result?.error;
  const openOnKeyboard = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); setIsExpanded(true);
    }
  };
  const changeZoom = (delta) => setZoom((value) => Math.min(3, Math.max(0.4, Number((value + delta).toFixed(2)))));
  const expandedViewer = isExpanded && result?.svg ? createPortal(
    <div className="diagram-lightbox" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setIsExpanded(false);
    }}>
      <section className="diagram-lightbox-panel" role="dialog" aria-modal="true" aria-label="Expanded diagram viewer">
        <header className="diagram-lightbox-header">
          <div className="diagram-viewer-title">
            <strong>Diagram preview</strong>
            <span>Scroll to explore · Esc to close</span>
          </div>
          <div className="diagram-lightbox-actions">
            <div className="diagram-zoom-controls" aria-label="Diagram zoom controls">
              <button type="button" aria-label="Zoom out" title="Zoom out" onClick={() => changeZoom(-0.2)}>−</button>
              <span className="diagram-zoom-level">{Math.round(zoom * 100)}%</span>
              <button type="button" aria-label="Zoom in" title="Zoom in" onClick={() => changeZoom(0.2)}>+</button>
              <button type="button" onClick={() => { setZoom(1); if (viewportRef.current) { viewportRef.current.scrollTop = 0; viewportRef.current.scrollLeft = 0; } }}>Fit</button>
            </div>
            <button type="button" onClick={() => copyTextToClipboard(source)}>Copy source</button>
            <button ref={closeButtonRef} type="button" className="diagram-lightbox-close" onClick={() => setIsExpanded(false)} aria-label="Close expanded diagram" title="Close">×</button>
          </div>
        </header>
        <div className="diagram-lightbox-content" ref={viewportRef}>
          <div className="diagram-zoom-canvas" style={{ zoom }} dangerouslySetInnerHTML={{ __html: result.svg }} />
        </div>
        <footer className="diagram-viewer-footer">Use the zoom controls to inspect labels and complex branches</footer>
      </section>
    </div>,
    document.body,
  ) : null;

  return (
    <>
      <div className="code-card mermaid-card">
        <div className="code-card-header">
          <span>Diagram</span>
          <div className="mermaid-card-actions">
            {result?.svg && <button type="button" className="mermaid-expand-button" onClick={() => setIsExpanded(true)} aria-label="Maximize diagram" title="Maximize diagram"><span aria-hidden="true">⛶</span><span>Expand</span></button>}
            <button type="button" onClick={() => copyTextToClipboard(source)}>Copy source</button>
          </div>
        </div>
        {result?.svg ? (
          <div className="mermaid-diagram" role="button" tabIndex={0} aria-label="Open generated diagram in expanded view" onClick={() => setIsExpanded(true)} onKeyDown={openOnKeyboard} title="Click to expand diagram" dangerouslySetInnerHTML={{ __html: result.svg }} />
        ) : hasError ? (
          <><div className="mermaid-error" role="status">{sourceTooLong ? "This diagram is too large to render. Mermaid source is shown below." : "This diagram could not be rendered. Mermaid source is shown below."}</div><pre><code>{source}</code></pre></>
        ) : <div className="mermaid-status" role="status">Rendering diagram…</div>}
      </div>
      {expandedViewer}
    </>
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
                  onClick={() => copyTextToClipboard(block.content)}
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
  { status: "INIT", text: "Starting Helmora runtime" },

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
          <span>helmora — startup console</span>
          <span className="boot-version">v1.0</span>
        </div>

        <div className="boot-brand">
          <div className="boot-logo">
            <HelmoraLogo />
          </div>
          <div>
            <h1 className="cloudsaathi-wordmark">
              Helmora<span>.</span>
            </h1>
            <p>AI mentor for cloud and DevOps</p>
          </div>
        </div>

        <div className="boot-terminal">
          <div className="boot-command">
            <span>$</span> helmora --initialize
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
      id="landing-top"
      className={`landing-page ${theme === "light" ? "landing-light" : ""} ${isExiting ? "is-exiting" : ""}`}
      onAnimationEnd={(event) => {
        if (isExiting && event.target === event.currentTarget) onExitComplete();
      }}
    >
      <div className="landing-ambient ambient-one" />
      <div className="landing-ambient ambient-two" />
      <div className="landing-grid" />
      <div className="landing-motion-field" aria-hidden="true">
        <span className="landing-float-shape shape-one" />
        <span className="landing-float-shape shape-two" />
        <span className="landing-float-shape shape-three" />
        <span className="landing-float-shape shape-four" />
        <span className="landing-float-shape shape-five" />
        <span className="landing-float-shape shape-six" />
        <span className="landing-float-shape shape-seven" />
      </div>

      <main id="home">
        <section className="landing-hero landing-compact-hero">
          <div className="landing-hero-copy landing-reveal">
            <h1>
              Hi, I'm <span>Helmora.</span>
            </h1>

            <p>
              Your AI mentor for cloud and DevOps. What would you like to learn
              today?
            </p>

            <div className="landing-hero-actions">
              <button
                className="landing-primary"
                type="button"
                onClick={onEnter}
              >
                Ask your first question <span>↗</span>
              </button>
              <button
                className="landing-secondary landing-secondary-button"
                type="button"
                onClick={onEnter}
              >
                Try as guest
              </button>
            </div>
          </div>
        </section>
      </main>
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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = Number(window.localStorage.getItem("helmora-sidebar-width"));
      return Number.isFinite(saved) && saved >= 220 && saved <= 420 ? saved : 260;
    } catch {
      return 260;
    }
  });
  const sidebarResizeRef = useRef({ active: false, startX: 0, startWidth: 260, currentWidth: 260 });
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedLibraryStack, setSelectedLibraryStack] = useState("");
  const [libraryClosing, setLibraryClosing] = useState(false);

  useEffect(() => {
    if (!libraryOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLibrary();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [libraryOpen]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!sidebarResizeRef.current.active) return;
      const delta = event.clientX - sidebarResizeRef.current.startX;
      const nextWidth = Math.min(420, Math.max(220, sidebarResizeRef.current.startWidth + delta));
      sidebarResizeRef.current.currentWidth = nextWidth;
      setSidebarWidth(nextWidth);
    };
    const handlePointerUp = () => {
      if (!sidebarResizeRef.current.active) return;
      sidebarResizeRef.current.active = false;
      document.body.classList.remove("sidebar-is-resizing");
      try {
        window.localStorage.setItem("helmora-sidebar-width", String(sidebarResizeRef.current.currentWidth));
      } catch {
        // Width remains available in React state when storage is unavailable.
      }
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.body.classList.remove("sidebar-is-resizing");
    };
  }, []);
  const [showRecentHistory, setShowRecentHistory] = useState(true);

  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const [bootStep, setBootStep] = useState(0);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [attachments, setAttachments] = useState([]);

  const [attachmentError, setAttachmentError] = useState("");

  const [readingFiles, setReadingFiles] = useState(false);

  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);

  const [showModelDetails, setShowModelDetails] = useState(false);

  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

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

  const composerTextareaRef = useRef(null);

  const attachmentMenuRef = useRef(null);

  const attachmentMenuTriggerRef = useRef(null);

  const imageFileInputRef = useRef(null);

  const textFileInputRef = useRef(null);

  const readingFilesRef = useRef(false);

  const shouldScrollToBottomRef = useRef(false);

  const requestVersionRef = useRef(0);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!shouldScrollToBottomRef.current) return;

    shouldScrollToBottomRef.current = false;

    const pane = chatScrollRef.current;

    if (pane) pane.scrollTop = pane.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const pane = chatScrollRef.current;
    if (!pane) return undefined;

    const updateScrollButton = () => {
      const distanceFromBottom =
        pane.scrollHeight - pane.scrollTop - pane.clientHeight;
      setShowScrollToBottom(distanceFromBottom > 120);
    };

    updateScrollButton();
    pane.addEventListener("scroll", updateScrollButton, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollButton)
        : null;
    resizeObserver?.observe(pane);
    if (pane.firstElementChild) resizeObserver?.observe(pane.firstElementChild);

    return () => {
      pane.removeEventListener("scroll", updateScrollButton);
      resizeObserver?.disconnect();
    };
  }, [showLanding, messages.length]);

  const scrollChatToBottom = () => {
    const pane = chatScrollRef.current;
    if (!pane) return;
    pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
    setShowScrollToBottom(false);
  };

  function appendAssistantMessage(text, shouldScrollToBottom = false) {
    shouldScrollToBottomRef.current = shouldScrollToBottom;
    setMessages((current) => [
      ...current,
      { role: "assistant", text, timestamp: Date.now() },
    ]);
  }

  async function addAttachments(fileList, expectedKind) {
    const files = Array.from(fileList || []);
    if (!files.length || loading || readingFilesRef.current) return;

    readingFilesRef.current = true;
    setReadingFiles(true);
    setAttachmentError("");

    const nextAttachments = [...attachments];
    const errors = [];
    let totalBytes = nextAttachments.reduce((total, item) => total + item.size, 0);
    let totalTextChars = nextAttachments.reduce(
      (total, item) => total + (item.kind === "text" ? item.content.length : 0),
      0,
    );

    for (const file of files) {
      const duplicate = nextAttachments.some(
        (item) =>
          item.name === file.name &&
          item.size === file.size &&
          item.lastModified === file.lastModified,
      );
      if (duplicate) continue;

      if (nextAttachments.length >= MAX_ATTACHMENTS) {
        errors.push(`You can attach up to ${MAX_ATTACHMENTS} files per message.`);
        break;
      }

      if (file.size <= 0) {
        errors.push(`${file.name} is empty.`);
        continue;
      }

      if (totalBytes + file.size > MAX_ATTACHMENT_BYTES) {
        errors.push("Attachments must total 4 MB or less.");
        continue;
      }

      const extension = file.name.split(".").pop().toLowerCase();
      const imageMimeType = IMAGE_TYPES_BY_EXTENSION[extension];
      const isDockerfile = file.name.toLowerCase() === "dockerfile";
      const isTextFile = isDockerfile || TEXT_FILE_EXTENSIONS.has(extension);
      const kind = imageMimeType ? "image" : isTextFile ? "text" : "";

      if (!kind || (expectedKind && kind !== expectedKind)) {
        errors.push(
          `${file.name} isn't a supported ${expectedKind || "image or text"} file.`,
        );
        continue;
      }

      if (kind === "image" && file.type && file.type !== imageMimeType) {
        errors.push(`${file.name} doesn't match its image file type.`);
        continue;
      }

      try {
        if (kind === "image") {
          const preview = await readFileAsDataUrl(file);
          if (typeof preview !== "string" || !preview.startsWith("data:image/")) {
            throw new Error("Could not read this image.");
          }
          nextAttachments.push({
            id: `${file.name}-${file.size}-${file.lastModified}`,
            name: file.name,
            kind,
            mimeType: imageMimeType,
            size: file.size,
            lastModified: file.lastModified,
            preview,
          });
        } else {
          const content = await file.text();
          if (!content.trim() || content.includes("\u0000")) {
            throw new Error("File must contain readable, non-empty text.");
          }
          if (totalTextChars + content.length > MAX_ATTACHMENT_TEXT_CHARS) {
            throw new Error(
              `Combined text attachments cannot exceed ${MAX_ATTACHMENT_TEXT_CHARS.toLocaleString()} characters.`,
            );
          }
          totalTextChars += content.length;
          nextAttachments.push({
            id: `${file.name}-${file.size}-${file.lastModified}`,
            name: file.name,
            kind,
            mimeType: file.type || "text/plain",
            size: file.size,
            lastModified: file.lastModified,
            content,
          });
        }
        totalBytes += file.size;
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`);
      }
    }

    setAttachments(nextAttachments);
    setAttachmentError(errors.join(" "));
    readingFilesRef.current = false;
    setReadingFiles(false);
  }

  useEffect(() => {
    const textarea = composerTextareaRef.current;
    if (!textarea) return;

    textarea.style.setProperty("height", "auto", "important");
    const maxHeight = 160;
    textarea.style.setProperty(
      "height",
      `${Math.min(textarea.scrollHeight, maxHeight)}px`,
      "important",
    );
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [input]);

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
    if (!isAttachmentMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (!attachmentMenuRef.current?.contains(event.target)) {
        setIsAttachmentMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsAttachmentMenuOpen(false);
        attachmentMenuTriggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAttachmentMenuOpen]);

  useEffect(() => {
    localStorage.setItem(
      "cloudsaathi-recent",
      JSON.stringify(recentlyAsked.slice(0, 5)),
    );
  }, [recentlyAsked]);

  async function send(text = input) {
    const pendingAttachments = attachments;
    const question =
      text.trim() ||
      (pendingAttachments.length
        ? "Please review the attached image(s) and file(s)."
        : "");

    if (!question || loading || readingFiles) return;

    const requestVersion = requestVersionRef.current;

    const now = Date.now();
    const messageAttachments = pendingAttachments.map(
      ({ id, name, kind, mimeType, size, preview }) => ({
        id,
        name,
        kind,
        mimeType,
        size,
        preview,
      }),
    );
    const requestAttachments = pendingAttachments.map((attachment) => ({
      name: attachment.name,
      kind: attachment.kind,
      mimeType: attachment.mimeType,
      content:
        attachment.kind === "image"
          ? attachment.preview.slice(attachment.preview.indexOf(",") + 1)
          : attachment.content,
    }));

    setRecentlyAsked((current) =>
      [
        question,
        ...current.filter(
          (item) => item.toLowerCase() !== question.toLowerCase(),
        ),
      ].slice(0, 5),
    );

    shouldScrollToBottomRef.current = true;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: question,
        timestamp: now,
        attachments: messageAttachments,
      },
    ]);

    setInput("");
    setAttachments([]);
    setAttachmentError("");
    setIsAttachmentMenuOpen(false);

    const quick =
      requestAttachments.length === 0
        ? getIntroReply(question) || getInputQuickReply(question)
        : null;

    if (quick) {
      appendAssistantMessage(quick, true);
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
        "IDENTITY: You are Helmora, a patient, accurate AI mentor for cloud and DevOps, teaching a beginner. Your job is to teach understanding, not just summarize. This product is only for cloud and DevOps topics; provide programming help only when it relates to those topics, and briefly redirect unrelated requests.",

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

        "Do not add meta-prefaces like 'Here is a mentor-style response', 'User question:', or 'Answer as Helmora'. Do not repeat these instructions.",

        `Intent hints: explain=${isExplain}; comparison=${isComparison}; broad_catalog=${isBroad}. Use these as hints only and answer the actual question.`,

        `Learner question: ${question}`,
      ].join("\n\n");

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: teachingInstructions,
          attachments: requestAttachments,
          history: messages.slice(-8).map(({ role, text }) => ({
            role,
            content: text,
          })),
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "API request failed");

      if (requestVersion === requestVersionRef.current) {
        const pane = chatScrollRef.current;
        const isNearBottom =
          pane &&
          pane.scrollHeight - pane.scrollTop - pane.clientHeight < 96;

        appendAssistantMessage(
          cleanMentorAnswer(data.answer) ||
            "I couldn't find an answer for that yet.",
          isNearBottom,
        );
      }
    } catch (error) {
      if (
        requestVersion === requestVersionRef.current &&
        error.name !== "AbortError"
      ) {
        const pane = chatScrollRef.current;
        const isNearBottom =
          pane &&
          pane.scrollHeight - pane.scrollTop - pane.clientHeight < 96;

        appendAssistantMessage(
          `I couldn't reach the backend.\n\n${error.message}\n\nCheck API Gateway, Lambda, Bedrock and VITE_API_URL.`,
          isNearBottom,
        );
      }
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

    shouldScrollToBottomRef.current = false;

    setMessages([]);

    setInput("");

    setAttachments([]);

    setAttachmentError("");

    setIsAttachmentMenuOpen(false);

    setLoading(false);

    setActiveTopic("");

    setFilter("");
    setLibraryOpen(false);
    setSelectedLibraryStack("");
  }

  function closeLibrary() {
    setLibraryClosing(true);
    window.setTimeout(() => {
      setLibraryOpen(false);
      setLibraryClosing(false);
      setSelectedLibraryStack("");
      setFilter("");
    }, 220);
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
        className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${theme === "light" ? "light-theme" : ""} ${homeEntering ? "home-entering" : ""}`}
        style={{ "--sidebar-width": `${sidebarWidth}px` }}
        data-theme={theme}
      >
        <aside className={`sidebar ${mobileLibraryOpen ? "library-open" : ""}`}>
          <div className="brand">
            <div className="brand-mark" aria-label="Helmora">
              <HelmoraLogo />
            </div>
            <div className="brand-copy">
              <strong className="cloudsaathi-wordmark">Helmora</strong>
            </div>
            <button
              className="sidebar-toggle"
              type="button"
              onClick={() => {
                if (window.matchMedia("(max-width: 760px)").matches) {
                  setMobileLibraryOpen((open) => !open);
                } else {
                  setSidebarCollapsed((collapsed) => !collapsed);
                }
              }}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!sidebarCollapsed}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
                <path d="M9 4v16" />
                <path d={sidebarCollapsed ? "m13 9 3 3-3 3" : "m16 9-3 3 3 3"} />
              </svg>
            </button>
          </div>

          <button
            className="new-chat-button"
            type="button"
            onClick={startNewChat}
            title="Start a fresh conversation"
          >
            <span className="new-chat-plus sidebar-action-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M14 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V10" />
                <path d="m11 13 8.5-8.5a2.1 2.1 0 0 1 3 3L14 16l-4 1z" />
              </svg>
            </span>
            <span className="new-chat-label">New chat</span>
          </button>

          <button
            className="sidebar-back-button"
            type="button"
            onClick={() => {
              requestVersionRef.current += 1;
              abortControllerRef.current?.abort();
              abortControllerRef.current = null;
              shouldScrollToBottomRef.current = false;
              setLoading(false);
              setHomeEntering(false);
              setLandingExiting(false);
              setShowLanding(true);
              setMobileLibraryOpen(false);
              setLibraryOpen(false);
              setShowRecentHistory(false);
              setSidebarCollapsed(false);
              setActiveTopic("");
              setFilter("");
              if (window.location.hash) {
                window.history.replaceState(
                  null,
                  "",
                  `${window.location.pathname}${window.location.search}`,
                );
              }
            }}
            aria-label="Back to Home"
            title="Back to Home"
          >
            <span className="sidebar-back-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="m3 10 9-7 9 7" />
                <path d="M5.5 9v11h13V9M9.5 20v-6h5v6" />
              </svg>
            </span>
            <span className="sidebar-back-label">Back to Home</span>
          </button>

          <div className="sidebar-quick-actions" aria-label="Sidebar shortcuts">
            <button
              className="sidebar-quick-action"
              type="button"
              onClick={() => {
                setSidebarCollapsed(false);
                setShowRecentHistory(false);
                setSelectedLibraryStack("");
                setFilter("");
                setLibraryClosing(false);
                setLibraryOpen(true);
                setMobileLibraryOpen(false);
              }}
              aria-label="Open Library"
              title="Library"
            >
              <span className="sidebar-quick-icon-slot" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4.5h4v15H4zM10 3h4v16h-4zM16 5h4v14h-4z" />
                <path d="M3 21h18" />
                </svg>
              </span>
              <span>Library</span>
            </button>
            <button
              className="sidebar-quick-action"
              type="button"
              onClick={() => {
                setLibraryOpen(false);
                setShowRecentHistory(true);
                setSidebarCollapsed(false);
                if (window.matchMedia("(max-width: 760px)").matches) {
                  setMobileLibraryOpen(true);
                }
              }}
              aria-label="Open Recents"
              title="Recents"
            >
              <span className="sidebar-quick-icon-slot" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.5 12a8.5 8.5 0 1 0 2.4-5.9L3.5 8.5" />
                <path d="M3.5 4.5v4h4M12 7v5l3.2 2" />
                </svg>
              </span>
              <span>Recents</span>
            </button>
          </div>

          <button
            className="sidebar-section-toggle library-section-toggle"
            type="button"
            onClick={() => {
              setShowRecentHistory(false);
              setSidebarCollapsed(false);
              setSelectedLibraryStack("");
              setFilter("");
              setLibraryClosing(false);
              setLibraryOpen(true);
              setMobileLibraryOpen(false);
            }}
            aria-expanded={libraryOpen}
            aria-controls="helmora-library-modal"
            title="Open Library"
          >
            <span className="sidebar-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 4.5h4v15H4zM10 3h4v16h-4zM16 5h4v14h-4z" />
                <path d="M3 21h18" />
              </svg>
            </span>
            <span className="sidebar-section-label">Library</span>
            <span className="sidebar-section-spacer" />
            <span className="topic-count">{topicCount}</span>
            <svg className="sidebar-section-chevron" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>

          <button
            className={`sidebar-section-toggle ${showRecentHistory ? "is-open" : ""}`}
            type="button"
            onClick={() => {
              setLibraryOpen(false);
              setShowRecentHistory((open) => !open);
            }}
            aria-expanded={showRecentHistory}
            aria-controls="recent-conversations-content"
            title={showRecentHistory ? "Collapse Recents" : "Expand Recents"}
          >
            <span className="sidebar-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M3.5 12a8.5 8.5 0 1 0 2.4-5.9L3.5 8.5" />
                <path d="M3.5 4.5v4h4M12 7v5l3.2 2" />
              </svg>
            </span>
            <span className="sidebar-section-label">Recents</span>
            <span className="sidebar-section-spacer" />
            <svg className="sidebar-section-chevron" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>

          {showRecentHistory && (
            <section className="recently-asked" id="recent-conversations-content" aria-label="Recent conversations">
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

          <div className="sidebar-footer">
            <button
              className="sidebar-theme-toggle"
              type="button"
              onClick={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="sidebar-footer-icon sidebar-action-icon" aria-hidden="true">
                {theme === "dark" ? "☀" : "☾"}
              </span>
              <span className="sidebar-footer-label">
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </button>

            <div
              className="sidebar-account"
              title="Guest session"
              aria-label="Guest session account"
            >
              <span className="account-avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M4.8 20c.5-3.7 3.4-5.8 7.2-5.8s6.7 2.1 7.2 5.8" />
                </svg>
              </span>
              <span className="account-details">
                <strong>Guest session</strong>
                <small>Currently browsing as guest</small>
              </span>
              <span className="account-status-dot" aria-hidden="true" />
            </div>
          </div>
          <div
            className="sidebar-resize-handle"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            title="Drag to resize sidebar"
            onPointerDown={(event) => {
              if (window.matchMedia("(max-width: 760px)").matches || sidebarCollapsed) return;
              event.preventDefault();
              sidebarResizeRef.current = {
                active: true,
                startX: event.clientX,
                startWidth: sidebarWidth,
                currentWidth: sidebarWidth,
              };
              document.body.classList.add("sidebar-is-resizing");
            }}
          />
        </aside>

        {mobileLibraryOpen && (
          <button
            className="library-backdrop"
            type="button"
            aria-label="Close technology library"
            onClick={() => setMobileLibraryOpen(false)}
          />
        )}

        <main className={`chat-main ${messages.length === 0 ? "is-empty" : "has-messages"}`}>
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
              <div className="connection-status">
                <span className="status-dot" />
                <span>Ready to help</span>
              </div>
            </div>
            <div className="topbar-actions" aria-hidden="true" />
          </header>

          <div className="chat-scroll" ref={chatScrollRef}>
            {messages.length === 0 && (
              <section className="welcome-panel">
                <div className="welcome-copy">
                  <h1>{getTimeGreeting()}, how can I help you today?</h1>
                  <p>Hey, Helmora is here :)</p>
                </div>
                <div className="welcome-suggestions" aria-label="Suggested topics">
                  {[
                    "Teach me AWS EC2",
                    "Explain Docker and containers",
                    "How does Kubernetes work?",
                    "Build a Terraform CI/CD pipeline",
                  ].map((prompt) => (
                    <button
                      className="welcome-suggestion"
                      key={prompt}
                      type="button"
                      onClick={() => {
                        setInput(prompt);
                        composerTextareaRef.current?.focus();
                      }}
                    >
                      <span>{prompt}</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section
              className="messages"
              aria-live="polite"
              aria-busy={loading}
            >
              {messages.length > 0 && (
                <div className="conversation-date-divider">
                  <span>{formatConversationDate(messages[0].timestamp)}</span>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  className={`message-row ${message.role}`}
                  key={`${index}-${message.role}`}
                >
                  <div className="message-content">
                    <div className="message-bubble">
                      <MessageContent
                        text={message.text}
                        role={message.role}
                        theme={theme}
                      />
                    </div>
                    {message.attachments?.length > 0 && (
                      <div className="sent-attachments" role="list" aria-label="Sent attachments">
                        {message.attachments.map((attachment) => (
                          <div
                            className="sent-attachment"
                            key={attachment.id}
                            role="listitem"
                          >
                            {attachment.kind === "image" ? (
                              <img
                                src={attachment.preview}
                                alt={`Attached image: ${attachment.name}`}
                              />
                            ) : (
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                focusable="false"
                              >
                                <path d="M7 3.75h7l4.25 4.25v12.25H7z" />
                                <path d="M14 3.75V8h4.25M9.5 12h6M9.5 15h6" />
                              </svg>
                            )}
                            <span title={attachment.name}>
                              {attachment.name}
                            </span>
                            <small>{formatFileSize(attachment.size)}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message-row assistant thinking-row">
                  <div className="message-content">
                    <div
                      className="thinking-status"
                      role="status"
                      aria-label="Helmora Thinking"
                    >
                      <span className="thinking-label">Helmora Thinking</span>
                      <span className="thinking-ellipsis" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </section>
          </div>

          <button
            className={`scroll-to-bottom-button ${showScrollToBottom ? "is-visible" : ""}`}
            type="button"
            onClick={scrollChatToBottom}
            aria-label="Scroll to latest message"
            title="Scroll to bottom"
            tabIndex={showScrollToBottom ? 0 : -1}
            aria-hidden={!showScrollToBottom}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 4v15" />
              <path d="m5 12 7 7 7-7" />
            </svg>
          </button>

          <form
            className={`composer ${isDraggingFiles ? "is-dragging" : ""} ${
              input.includes("\n") || input.length > 70 ? "is-expanded" : ""
            }`}
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            onDragOver={(event) => {
              if (!Array.from(event.dataTransfer.types).includes("Files")) {
                return;
              }
              event.preventDefault();
              setIsDraggingFiles(true);
            }}
            onDragLeave={(event) => {
              if (
                !event.relatedTarget ||
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                setIsDraggingFiles(false);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDraggingFiles(false);
              void addAttachments(event.dataTransfer.files);
            }}
          >
            <input
              ref={imageFileInputRef}
              className="hidden-file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              tabIndex={-1}
              onChange={(event) => {
                const files = Array.from(event.currentTarget.files || []);
                event.currentTarget.value = "";
                void addAttachments(files, "image");
              }}
            />
            <input
              ref={textFileInputRef}
              className="hidden-file-input"
              type="file"
              accept=".txt,.md,.csv,.json,.yaml,.yml,.log,.tf,.tfvars,.py,.sh,.xml,.conf,.ini,.properties,Dockerfile"
              multiple
              tabIndex={-1}
              onChange={(event) => {
                const files = Array.from(event.currentTarget.files || []);
                event.currentTarget.value = "";
                void addAttachments(files, "text");
              }}
            />
            {attachments.length > 0 && (
              <div
                className="pending-attachments"
                role="list"
                aria-label="Files to send"
              >
                {attachments.map((attachment) => (
                  <div
                    className="pending-attachment"
                    key={attachment.id}
                    role="listitem"
                  >
                    {attachment.kind === "image" ? (
                      <img src={attachment.preview} alt="" />
                    ) : (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        focusable="false"
                      >
                        <path d="M7 3.75h7l4.25 4.25v12.25H7z" />
                        <path d="M14 3.75V8h4.25M9.5 12h6M9.5 15h6" />
                      </svg>
                    )}
                    <span title={attachment.name}>{attachment.name}</span>
                    <small>{formatFileSize(attachment.size)}</small>
                    <button
                      className="remove-attachment"
                      type="button"
                      onClick={() => {
                        setAttachments((current) =>
                          current.filter((item) => item.id !== attachment.id),
                        );
                        setAttachmentError("");
                      }}
                      aria-label={`Remove ${attachment.name}`}
                      title={`Remove ${attachment.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="composer-input-row">
              <div
                className="composer-add-menu"
                ref={attachmentMenuRef}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsAttachmentMenuOpen(false);
                  }
                }}
              >
                <button
                  ref={attachmentMenuTriggerRef}
                  className={`composer-add-button ${isAttachmentMenuOpen ? "is-open" : ""}`}
                  type="button"
                  onClick={() =>
                    setIsAttachmentMenuOpen((isOpen) => !isOpen)
                  }
                  disabled={
                    loading ||
                    readingFiles ||
                    attachments.length >= MAX_ATTACHMENTS
                  }
                  aria-label="Add an image or file"
                  aria-expanded={isAttachmentMenuOpen}
                  aria-controls="composer-upload-menu"
                  title="Add an image or file"
                >
                  <svg
                    className="composer-plus-icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    focusable="false"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <div
                  className="composer-upload-menu"
                  id="composer-upload-menu"
                  role="group"
                  aria-label="Choose an attachment type"
                  hidden={!isAttachmentMenuOpen}
                >
                  <button
                    className="composer-upload-option model-menu-action"
                    type="button"
                    onClick={() => setShowModelDetails((open) => !open)}
                    aria-expanded={showModelDetails}
                    aria-controls="composer-model-details"
                  >
                    <span className="model-menu-copy">
                      <strong>Model</strong>
                      <small>View the active AI model</small>
                    </span>
                    <span className="model-menu-chevron" aria-hidden="true">
                      {showModelDetails ? "⌄" : "›"}
                    </span>
                  </button>
                  {showModelDetails && (
                    <div
                      className="model-details-option"
                      id="composer-model-details"
                      role="status"
                      aria-label="Active model: Amazon Nova Lite"
                    >
                      <span className="model-status-dot" aria-hidden="true" />
                      <strong>Amazon Nova Lite</strong>
                      <span className="model-active-label">ACTIVE</span>
                    </div>
                  )}
                  <button
                    className="composer-upload-option image-upload-action"
                    type="button"
                    onClick={() => {
                      setIsAttachmentMenuOpen(false);
                      imageFileInputRef.current?.click();
                    }}
                  >
                    <svg
                      className="upload-icon"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      focusable="false"
                    >
                      <rect x="3.5" y="4" width="17" height="16" rx="3" />
                      <circle cx="9" cy="9.5" r="1.5" />
                      <path d="m5 17 4.5-4.5 3 3 2-2L19 18" />
                    </svg>
                    <span>
                      <strong>Image</strong>
                      <small>PNG, JPEG, or WebP</small>
                    </span>
                  </button>
                  <button
                    className="composer-upload-option file-upload-action"
                    type="button"
                    onClick={() => {
                      setIsAttachmentMenuOpen(false);
                      textFileInputRef.current?.click();
                    }}
                  >
                    <svg
                      className="upload-icon"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      focusable="false"
                    >
                      <path d="M7 3.75h7l4.25 4.25v12.25H7z" />
                      <path d="M14 3.75V8h4.25M9.5 12h6M9.5 15h6" />
                    </svg>
                    <span>
                      <strong>File</strong>
                      <small>Text, config, or log</small>
                    </span>
                  </button>
                </div>
              </div>
              <textarea
                ref={composerTextareaRef}
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                onPaste={(event) => {
                  const files = Array.from(event.clipboardData.files || []);
                  if (files.length > 0) {
                    event.preventDefault();
                    void addAttachments(files);
                  }
                }}
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
                placeholder="Ask Helmora..."
                aria-label="Ask Helmora"
                aria-describedby="composer-guidance"
                maxLength={4000}
                rows={1}
              />
              <button
                className={`send-button ${loading ? "is-generating" : ""}`}
                type={loading ? "button" : "submit"}
                disabled={!loading && ((!input.trim() && attachments.length === 0) || readingFiles)}
                onClick={loading ? stopGenerating : undefined}
                aria-label={loading ? "Stop generating response" : "Send message"}
                title={loading ? "Stop generating" : "Send message"}
              >
                {loading ? (
                  <span className="generation-wave" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                ) : (
                  <svg
                    className="send-icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    focusable="false"
                  >
                    <path d="m21 3-7.2 18-3.7-7.1L3 10.2 21 3Z" />
                    <path d="M10.1 13.9 15 9" />
                  </svg>
                )}
              </button>
            </div>
            {attachmentError && (
              <p className="attachment-error" role="alert">
                {attachmentError}
              </p>
            )}
            {readingFiles && (
              <div className="composer-footer">
                <span className="upload-status" role="status">
                  Preparing files…
                </span>
              </div>
            )}
            {isDraggingFiles && (
              <div className="composer-drop-message" aria-hidden="true">
                Drop images or text files to attach
              </div>
            )}
          </form>
        </main>
      </div>
      {libraryOpen && createPortal(
        <div
          className="library-modal-backdrop"
          data-theme={theme}
          style={{ "--library-offset": `${sidebarCollapsed ? 76 : sidebarWidth}px` }}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLibrary();
            }
          }}
        >
          <section
            className={`library-glass-panel ${libraryClosing ? "is-closing" : ""}`}
            id="helmora-library-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="helmora-library-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="library-modal-header">
              <div className="library-modal-heading">
                <span className="library-modal-mark" aria-hidden="true">▥</span>
                <div>
                  <h2 id="helmora-library-title">Explore technologies</h2>
                  <p>Choose a technology and explore its learning topics.</p>
                </div>
              </div>
              <div className="library-modal-controls">
                <span className="library-modal-tag">Library <b>{topicCount}</b></span>
                <button
                  className="library-modal-close"
                  type="button"
                  onClick={closeLibrary}
                  aria-label="Close Library"
                  title="Close Library"
                >×</button>
              </div>
            </header>

            <div className="library-modal-search-wrap">
              {selectedLibraryStack && (
                <button
                  className="library-back-button"
                  type="button"
                  onClick={() => setSelectedLibraryStack("")}
                >
                  <span aria-hidden="true">←</span> All technologies
                </button>
              )}
              <label className="library-modal-search">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                <input
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  placeholder={selectedLibraryStack ? "Search topics..." : "Search technologies..."}
                  aria-label={selectedLibraryStack ? "Search topics" : "Search technologies"}
                  autoFocus
                />
                {filter && (
                  <button type="button" onClick={() => setFilter("")} aria-label="Clear search">×</button>
                )}
              </label>
            </div>

            <div className="library-modal-content">
              {!selectedLibraryStack ? (
                <div className="library-tech-grid">
                  {filteredTopics.map((stack) => {
                    const count = stack.categories.reduce((total, category) => total + category.items.length, 0);
                    return (
                      <button
                        className="library-tech-card"
                        type="button"
                        key={stack.name}
                        onClick={() => setSelectedLibraryStack(stack.name)}
                      >
                        <StackBrandIcon name={stack.name} fallback={stack.icon} />
                        <span className="library-tech-card-copy">
                          <strong>{stack.name}</strong>
                          <small>{count} learning topics</small>
                        </span>
                        <span className="library-card-arrow" aria-hidden="true">↗</span>
                      </button>
                    );
                  })}
                  {filteredTopics.length === 0 && <p className="library-empty">No technologies match your search.</p>}
                </div>
              ) : (
                <div className="library-topic-view">
                  {filteredTopics.filter((stack) => stack.name === selectedLibraryStack).map((stack) => (
                    <div className="library-topic-stack" key={stack.name}>
                      <div className="library-selected-tech">
                        <StackBrandIcon name={stack.name} fallback={stack.icon} />
                        <div><strong>{stack.name}</strong><small>{stack.categories.reduce((total, category) => total + category.items.length, 0)} topics available</small></div>
                      </div>
                      <div className="library-category-grid">
                        {stack.categories.map((category) => (
                          <section className="library-topic-category" key={category.name}>
                            <header><strong>{category.name}</strong><span>{category.items.length}</span></header>
                            <div className="library-topic-list">
                              {category.items.map((topic) => (
                                <button
                                  className={`library-topic-card ${activeTopic === topic ? "active" : ""}`}
                                  type="button"
                                  key={topic}
                                  onClick={() => {
                                    chooseTopic(topic);
                                    closeLibrary();
                                    setMobileLibraryOpen(false);
                                  }}
                                  title={`Ask Helmora about ${topic}`}
                                >
                                  <span>{topic}</span><span aria-hidden="true">↗</span>
                                </button>
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredTopics.every((stack) => stack.name !== selectedLibraryStack) && (
                    <p className="library-empty">No topics match your search in this technology.</p>
                  )}
                </div>
              )}
            </div>
            <footer className="library-modal-footer">
              <span>Helmora Learning Library</span>
              <span>{topicCount} curated topics</span>
            </footer>
          </section>
        </div>,
        document.body
      )}
    </>
  );
}

export default App;
