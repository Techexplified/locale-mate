import { useState } from "react";
import {
  Sparkles,
  Megaphone,
  FileText,
  Zap,
  Target,
  Hash,
  Lightbulb,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";

/**
 * Cleaner + Professional Campaign Result UI
 * Minimal modern dashboard styling
 */

function parseSections(rawContent) {
  if (!rawContent) return [];

  const lines = rawContent.split("\n");
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const headerMatch = line.match(/^#{1,3}\s+(.*)/);

    if (headerMatch) {
      if (currentSection) sections.push(currentSection);

      const headerText = headerMatch[1].trim();
      const type = detectSectionType(headerText);

      currentSection = {
        type,
        title: cleanTitle(headerText),
        icon: getSectionIcon(type),
        content: "",
      };
    } else if (currentSection) {
      currentSection.content += line + "\n";
    }
  }

  if (currentSection) sections.push(currentSection);

  return sections.map((s) => ({
    ...s,
    content: s.content.trim(),
  }));
}

function detectSectionType(header) {
  const lower = header.toLowerCase();

  if (lower.includes("headline")) return "headline";
  if (lower.includes("ad copy")) return "adcopy";
  if (lower.includes("cta")) return "cta";
  if (lower.includes("audience")) return "audience";
  if (lower.includes("hashtag")) return "hashtags";
  if (lower.includes("strategy")) return "strategy";

  return "general";
}

function cleanTitle(title) {
  return title.replace(/\*\*/g, "").trim();
}

function getSectionIcon(type) {
  const icons = {
    headline: <Megaphone size={18} />,
    adcopy: <FileText size={18} />,
    cta: <Zap size={18} />,
    audience: <Target size={18} />,
    hashtags: <Hash size={18} />,
    strategy: <Lightbulb size={18} />,
    general: <Sparkles size={18} />,
  };

  return icons[type] || <Sparkles size={18} />;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition"
    >
      <Copy size={14} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function InlineMarkdown({ text }) {
  if (!text) return null;

  const boldRegex = /\*\*(.*?)\*\*/g;

  const parts = text.split(boldRegex);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-gray-900">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function RenderContent({ text }) {
  if (!text) return null;

  const lines = text.split("\n").filter((line) => line.trim());

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          /^\d+\.\s/.test(trimmed)
        ) {
          const bullet = trimmed.replace(/^[-*]\s|^\d+\.\s/, "");

          return (
            <div key={i} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2"></div>

              <p className="text-sm text-gray-700 leading-7">
                <InlineMarkdown text={bullet} />
              </p>
            </div>
          );
        }

        return (
          <p key={i} className="text-sm leading-7 text-gray-700">
            <InlineMarkdown text={trimmed} />
          </p>
        );
      })}
    </div>
  );
}

function SectionCard({ section }) {
  const isHeadline = section.type === "headline";
  const isHashtags = section.type === "hashtags";

  if (isHeadline) {
    return (
      <div className="border border-gray-200 rounded-xl bg-white p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-500">
            {section.icon}

            <span className="text-xs uppercase tracking-wider font-semibold">
              {section.title}
            </span>
          </div>

          <CopyButton text={section.content} />
        </div>

        <h2 className="text-3xl font-semibold text-gray-900 leading-tight">
          {section.content.replace(/\*\*/g, "").replace(/^"|"$/g, "")}
        </h2>
      </div>
    );
  }

  if (isHashtags) {
    const tags = section.content
      .split(/[\s,]+/)
      .filter((tag) => tag.trim());

    return (
      <div className="border border-gray-200 rounded-xl bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-gray-700">
            {section.icon}

            <h3 className="font-semibold">{section.title}</h3>
          </div>

          <CopyButton text={section.content} />
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gray-700">
          {section.icon}

          <h3 className="font-semibold">{section.title}</h3>
        </div>

        <CopyButton text={section.content} />
      </div>

      <RenderContent text={section.content} />
    </div>
  );
}

export default function CampaignResult({
  content,
  onRegenerate,
  isRegenerating,
  campaignTitle,
}) {
  const [copiedAll, setCopiedAll] = useState(false);

  if (!content) return null;

  const sections = parseSections(content);

  function copyAll() {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedAll(true);

      setTimeout(() => {
        setCopiedAll(false);
      }, 2000);
    });
  }

  function downloadCampaign() {
    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `${campaignTitle || "campaign"}.txt`;

    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Generated Campaign
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            AI-generated marketing campaign
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyAll}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium"
          >
            <Copy size={16} />

            {copiedAll ? "Copied" : "Copy All"}
          </button>

          <button
            onClick={downloadCampaign}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium"
          >
            <Download size={16} />
            Download
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-sm font-medium transition"
          >
            <RefreshCw
              size={16}
              className={isRegenerating ? "animate-spin" : ""}
            />

            {isRegenerating ? "Generating..." : "Regenerate"}
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {sections.map((section, index) => (
          <SectionCard key={index} section={section} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center gap-6 text-xs text-gray-400 border-t border-gray-200 pt-4">
        <span>{sections.length} sections</span>

        <span>{content.split(/\s+/).length} words</span>

        <span>GPT-4o Mini</span>
      </div>
    </div>
  );
}