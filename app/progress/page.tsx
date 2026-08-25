import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgressDashboard } from "@/components/learner/ProgressDashboard";
import { getLevels, getModules } from "@/lib/data";

export const metadata: Metadata = {
  title: "My progress",
  description:
    "Your Definition of Done self-check progress across every module - stored only in your browser.",
};

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Progress" }]}
      />
      <h1 className="mt-6 font-display text-4xl tracking-tight text-foreground">
        My progress
      </h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
        Self-check completion across every live module. Check items on each
        module page; this dashboard follows along.
      </p>
      <div className="mt-8">
        <ProgressDashboard levels={getLevels()} modules={getModules()} />
      </div>
    </div>
  );
}
