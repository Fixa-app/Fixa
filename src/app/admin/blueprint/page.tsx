import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Phase = {
  category: string;
  actionNumber: number;
  action: string;
  description: string;
};

const phases: Phase[] = [
  {
    category: "Better leads",
    actionNumber: 1,
    action: "Intake",
    description:
      "Capture and qualify incoming work — online, manual entry, or via the Client Hub. Handles request creation and the optional on-location assessment.",
  },
  {
    category: "More work",
    actionNumber: 2,
    action: "Quote",
    description:
      "Compose interactive quotes, pull in supplier input when needed, share with the client, iterate until accepted.",
  },
  {
    category: "Work smarter",
    actionNumber: 3,
    action: "Job",
    description:
      "Convert accepted quotes into scheduled work. Order materials, align co-workers, dispatch, execute.",
  },
  {
    category: "More profits",
    actionNumber: 4,
    action: "Invoice",
    description:
      "Bill for completed work (incl. fractional payments), remind, get paid, close the loop.",
  },
];

export default function BlueprintPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-16">
      <header className="flex flex-col gap-3 pb-12">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Fixa
        </p>
        <h1 className="font-display text-5xl font-medium tracking-tight sm:text-6xl">
          Blueprint
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          The source of truth for what Fixa is. Four funnel phases, four key
          actions. Each action becomes its own dashboard page.
        </p>
      </header>

      <section className="border-t border-border pt-16">
        <div className="flex flex-col gap-2 pb-10">
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Product flow
          </p>
          <h2 className="font-display text-3xl font-medium tracking-tight">
            Four phases, four key actions
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Each phase owns one key action — the dashboard where the work for
            that phase happens. The arrows trace a single deal&apos;s journey
            from incoming request to paid invoice.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-4 sm:gap-4">
          {phases.map((phase, i) => (
            <div key={phase.category} className="relative flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  0{i + 1}
                </p>
                <h3 className="font-display text-xl font-medium tracking-tight">
                  {phase.category}
                </h3>
              </div>
              <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {phase.actionNumber}
                  </span>
                  <h4 className="text-lg font-semibold">{phase.action}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {phase.description}
                </p>
              </div>
              {i < phases.length - 1 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-[7.5rem] -right-3 hidden sm:block"
                >
                  <ArrowRight className="size-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-col gap-4 border-t border-border pt-16">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Decision
        </p>
        <h2 className="font-display text-2xl font-medium tracking-tight">
          Request + Intake merge into a single Intake dashboard
        </h2>
        <p className="max-w-3xl text-base text-muted-foreground">
          The full workflow in{" "}
          <Link
            href="/plan/workflow"
            className="font-medium underline underline-offset-2"
          >
            /plan/workflow
          </Link>{" "}
          separates Request (capturing work) from Intake (qualifying / optional
          on-location assessment). In practice every request flows through the
          same qualification logic, and operators think of them as one step:
          &quot;a new aanvraag came in — what do we do with it?&quot; Collapsing
          them into one dashboard reduces tab-switching without losing the
          underlying decision points — those become flow inside the Intake
          dashboard rather than a separate surface.
        </p>
      </section>
    </div>
  );
}
