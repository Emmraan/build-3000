"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * The dual-check: after self-verifying via the DoD checklist, the learner
 * copies this prompt into their own AI coding agent. The agent audits the
 * project independently; comparing both results exposes gaps on either side.
 */
export function VerificationPromptBox({
  moduleTitle,
  prompt,
}: {
  moduleTitle: string;
  prompt: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Verification prompt - paste into your AI agent
        </p>
        <button
          type="button"
          onClick={copy}
          className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200 active:scale-[0.98] ${
            copied
              ? "bg-accent text-accent-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            {copied ? (
              <Check aria-hidden="true" className="h-3.5 w-3.5 animate-settle" />
            ) : (
              <Copy aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
      <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed text-foreground">
        {prompt}
      </pre>
      <p className="border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground">
        Run this against &ldquo;{moduleTitle}&rdquo; after your own checklist
        pass. Where the agent and you disagree, investigate before moving on.
      </p>
    </div>
  );
}
