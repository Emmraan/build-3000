import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  AgentGuidanceBlock,
  Breadcrumbs,
  ConceptGrid,
  DodChecklist,
  DomainBadge,
  EmptyState,
  ExampleList,
  ExplanationList,
  LevelCard,
  MistakeCallout,
  ModuleCard,
  ProgressBar,
  ProjectBriefCard,
  ReviewQuestions,
  StatusBadge,
  VerificationPromptBox,
  VocabularyList,
} from "../components/ui";
import {
  getLevels,
  getModuleBySlug,
  getModulesForLevel,
} from "../lib/data";

// Minimal Link stub: renderToString has no router; hrefs resolve to strings.
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: unknown;
    children: React.ReactNode;
  }) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  ),
}));

const foundations = getModuleBySlug("what-is-software");
const tracker = getModuleBySlug("databases-and-crud");

/** renderToString escapes entities and injects comment markers between text
 *  nodes - decode both so assertions can use plain source strings. */
function decode(html: string): string {
  return html
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

describe("ui smoke renders with live curriculum data", () => {
  it("LevelCard renders every level with badge and outcome", () => {
    for (const level of getLevels()) {
      const html = decode(renderToString(<LevelCard level={level} />));
      expect(html).toContain(level.name);
      expect(html).toContain(level.outcome);
      expect(html).toContain(`Level ${level.order}`);
      expect(html).toContain(level.status === "live" ? "Live" : "Roadmap");
    }
  });

  it("ModuleCard renders domain and summary", () => {
    const entry = getModulesForLevel("level-0-foundations")[1];
    const html = decode(renderToString(<ModuleCard module={entry} />));
    expect(html).toContain(entry.title);
    expect(html).toContain(entry.summary);
  });

  it("VocabularyList marks every term", () => {
    expect(foundations).toBeDefined();
    const html = decode(
      renderToString(<VocabularyList vocabulary={foundations!.vocabulary} />),
    );
    for (const item of foundations!.vocabulary) {
      expect(html).toContain(item.term);
      expect(html).toContain(item.meaning);
    }
    expect(html).toContain("<mark");
  });

  it("ConceptGrid and MistakeCallout render content", () => {
    expect(foundations).toBeDefined();
    const concepts = decode(
      renderToString(<ConceptGrid concepts={foundations!.concepts} />),
    );
    expect(concepts).toContain(foundations!.concepts[0].name);
    const mistake = decode(
      renderToString(<MistakeCallout mistake={foundations!.commonMistakes[0]} />),
    );
    expect(mistake).toContain("Common mistake");
    expect(mistake).toContain(foundations!.commonMistakes[0].fix);
  });

  it("ProjectBriefCard shows requirements and agent context", () => {
    expect(tracker).toBeDefined();
    const html = decode(
      renderToString(<ProjectBriefCard project={tracker!.project} />),
    );
    expect(html).toContain(tracker!.project.title);
    expect(html).toContain(tracker!.project.requirements[0]);
    expect(html).toContain(tracker!.project.agentContext);
  });

  it("VerificationPromptBox renders prompt text", () => {
    expect(tracker).toBeDefined();
    const html = decode(
      renderToString(
        <VerificationPromptBox
          moduleTitle={tracker!.title}
          prompt={tracker!.verificationPrompt}
        />,
      ),
    );
    expect(html).toContain("Verification prompt");
    expect(html).toContain("Copy");
  });

  it("DodChecklist renders grouped items with checkboxes", () => {
    expect(tracker).toBeDefined();
    const html = decode(
      renderToString(
        <DodChecklist moduleSlug={tracker!.slug} dod={tracker!.definitionOfDone} />,
      ),
    );
    expect(html).toContain("Functional");
    expect(html).toContain('type="checkbox"');
    // checkbox count matches total DoD items across non-empty groups
    const total = Object.values(tracker!.definitionOfDone).reduce(
      (sum, items) => sum + items.length,
      0,
    );
    expect(html.match(/type="checkbox"/g)).toHaveLength(total);
  });
});

describe("static ui pieces", () => {
  it("Breadcrumbs mark the last crumb as current page", () => {
    const html = renderToString(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Curriculum", href: "/curriculum" },
          { label: "What Is Software?" },
        ]}
      />,
    );
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("What Is Software?");
  });

  it("badges render their status text", () => {
    expect(renderToString(<StatusBadge status="live" />)).toContain("Live");
    expect(renderToString(<StatusBadge status="roadmap" />)).toContain(
      "Roadmap",
    );
    expect(renderToString(<DomainBadge domain="databases" />)).toContain(
      "databases",
    );
  });

  it("EmptyState, ProgressBar, ReviewQuestions render basics", () => {
    expect(renderToString(<EmptyState title="Nothing here" />)).toContain(
      "Nothing here",
    );
    const progress = renderToString(
      <ProgressBar value={2} max={4} label="Self-verified" />,
    );
    expect(progress).toContain('aria-valuenow="2"');
    expect(foundations).toBeDefined();
    const questions = renderToString(
      <ReviewQuestions questions={foundations!.reviewQuestions} />,
    );
    expect(questions).toContain(foundations!.reviewQuestions[0]);
  });

  it("explanations, examples and agent guidance render", () => {
    expect(foundations).toBeDefined();
    expect(
      decode(
        renderToString(<ExplanationList explanations={foundations!.explanations} />),
      ),
    ).toContain(foundations!.explanations[0].title);
    expect(
      decode(renderToString(<ExampleList examples={foundations!.examples} />)),
    ).toContain(foundations!.examples[0].description);
    expect(
      decode(
        renderToString(
          <AgentGuidanceBlock guidance={foundations!.agentGuidance} />,
        ),
      ),
    ).toContain(foundations!.agentGuidance);
  });
});
