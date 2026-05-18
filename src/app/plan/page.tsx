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

type Section = {
  id: string;
  title: string;
  description: string;
  status: "empty" | "drafting" | "ready";
  href?: string;
  cta?: string;
  body?: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "phases",
    title: "Phases",
    description:
      "Release stages from first usable slice to broad launch. Each phase defines the minimum scope and the audience.",
    status: "empty",
  },
  {
    id: "workflows",
    title: "Workflows",
    description:
      "End-to-end user journeys the product needs to support. Built from the Miro board: Request → Intake → Quote → Job → Invoice, plus Supplier Hub and Client Hub.",
    status: "drafting",
    href: "/plan/workflow",
    cta: "Open workflow →",
  },
  {
    id: "integrations",
    title: "Integrations",
    description:
      "External systems Fixa connects to: payment, accounting, calendars, messaging, identity.",
    status: "empty",
  },
  {
    id: "open-questions",
    title: "Open questions",
    description:
      "Decisions we have not made yet. Park assumptions here so they do not get lost.",
    status: "empty",
  },
];

const statusVariant: Record<Section["status"], "secondary" | "default"> = {
  empty: "secondary",
  drafting: "default",
  ready: "default",
};

export default function PlanPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Home
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Fixa plan
          </h1>
          <p className="text-muted-foreground">
            Working surface for translating the Miro wireframes into a concrete
            spec. Edit the section content as decisions land.
          </p>
        </header>

        <Separator />

        <div className="grid gap-6">
          {sections.map((section) => (
            <Card key={section.id} id={section.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
                <Badge variant={statusVariant[section.status]}>
                  {section.status}
                </Badge>
              </CardHeader>
              <CardContent>
                {section.href ? (
                  <Link
                    href={section.href}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {section.cta ?? "Open →"}
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nothing here yet. Drop content from Miro when ready.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
