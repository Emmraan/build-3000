import { getGlossary, getLiveLevels, getModules } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

/**
 * llms.txt - a Markdown index of the site written for AI agents
 * (markdown-for-agents pattern). Static text, generated from live data.
 */
export function GET() {
  const levels = getLiveLevels();
  const modules = getModules();
  const glossary = getGlossary();

  const lines: string[] = [
    "# build-3000",
    "",
    "> The essential concepts for building software with AI coding agents. An open-source curriculum inspired by the Oxford 3000 core-vocabulary philosophy.",
    "",
    "AI writes the code. The human stays responsible: specify, delegate, inspect, verify, secure, ship.",
    "",
    "## Levels (live)",
    "",
  ];

  for (const level of levels) {
    const levelModules = modules.filter((module) => module.level === level.slug);
    lines.push(`- [Level ${level.order}: ${level.name}](${absoluteUrl(`/curriculum?level=${level.slug}`)}) - ${level.tagline} (${levelModules.length} modules)`);
  }

  lines.push("", "## Modules", "");

  for (const entry of modules) {
    lines.push(
      `- [${entry.title}](${absoluteUrl(`/curriculum/${entry.slug}`)}) - ${entry.summary}`,
    );
  }

  lines.push(
    "",
    "## Glossary",
    "",
    "Core terms with their curriculum meanings:",
    "",
  );

  for (const entry of glossary) {
    lines.push(`- **${entry.term}**: ${entry.meaning}`);
  }

  lines.push(
    "",
    `License: MIT. Contribute: ${absoluteUrl("/contribute")}`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
