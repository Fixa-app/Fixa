import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  hubs,
  linearStageOrder,
  stages,
  type WorkflowStage,
} from "@/data/workflow";

export default function WorkflowPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <Link
            href="/plan"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Plan
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Workflow
          </h1>
          <p className="text-muted-foreground">
            End-to-end customer journey, from request capture to paid invoice.
            Five linear stages plus two cross-cutting hubs that connect
            professionals, clients, and suppliers.
          </p>
        </header>

        <StageBar />

        <Separator />

        <section className="flex flex-col gap-6">
          {stages.map((stage) => (
            <StageCard key={stage.id} stage={stage} />
          ))}
        </section>

        <div className="flex flex-col gap-3 pt-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Cross-cutting hubs
          </h2>
          <p className="text-sm text-muted-foreground">
            Two surfaces that span the linear flow rather than slotting into one
            stage.
          </p>
        </div>

        <section className="flex flex-col gap-6">
          {hubs.map((hub) => (
            <StageCard key={hub.id} stage={hub} />
          ))}
        </section>
      </div>
    </main>
  );
}

function StageBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {linearStageOrder.map((stage, i) => (
        <span key={stage.id} className="flex items-center gap-2">
          <Link
            href={`#${stage.id}`}
            className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-medium text-foreground hover:bg-muted"
          >
            {stage.number}. {stage.title}
          </Link>
          {i < linearStageOrder.length - 1 && (
            <span className="text-muted-foreground">→</span>
          )}
        </span>
      ))}
    </div>
  );
}

function StageCard({ stage }: { stage: WorkflowStage }) {
  return (
    <Card
      id={stage.id}
      className={cn("scroll-mt-6 border-l-4", stage.accentClass)}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle>
            {stage.number ? `${stage.number}. ${stage.title}` : stage.title}
          </CardTitle>
          <CardDescription>{stage.summary}</CardDescription>
        </div>
        <Badge variant={stage.version === "v1" ? "default" : "secondary"}>
     {stage.version}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {stage.entryPoints && (
          <CardSection title="Entry points">
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {stage.entryPoints.map((entry, i) => (
                <li key={i}>{entry}</li>
              ))}
            </ul>
          </CardSection>
        )}

        <CardSection title="Flow">
          <ol className="list-decimal space-y-1.5 pl-5 text-sm">
            {stage.flow.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </CardSection>

        {stage.dashboard && (
          <CardSection title={`Dashboard: ${stage.dashboard.name}`}>
            <div className="flex flex-wrap gap-1.5">
              {stage.dashboard.states.map((state) => (
                <Badge key={state} variant="secondary" className="font-normal">
                  {state}
                </Badge>
              ))}
            </div>
          </CardSection>
        )}

        {stage.relatedViews && (
          <CardSection title="Related views">
            <ul className="space-y-1 text-sm">
              {stage.relatedViews.map((view) => (
                <li key={view.name}>
                  <span className="font-medium">{view.name}</span>
                  <span className="text-muted-foreground"> — {view.description}</span>
                </li>
              ))}
            </ul>
          </CardSection>
        )}

        {stage.clientTouchpoints && (
          <CardSection title="Client Hub touchpoints">
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {stage.clientTouchpoints.map((tp, i) => (
                <li key={i}>{tp}</li>
              ))}
            </ul>
          </CardSection>
        )}

        {stage.supplierTouchpoints && (
          <CardSection title="Supplier Hub touchpoints">
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {stage.supplierTouchpoints.map((tp, i) => (
                <li key={i}>{tp}</li>
              ))}
            </ul>
          </CardSection>
        )}
      </CardContent>
    </Card>
  );
}

function CardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}
