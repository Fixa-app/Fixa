import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Inbox,
  Mail,
  Receipt,
  Settings,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";

export default function DesignPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10">
      <header className="flex max-w-2xl flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Design</h1>
        <p className="text-muted-foreground">
          Living reference for how Fixa looks and feels. Use this as the source
          of truth when adding new UI — staying close to these patterns means
          new screens feel like they belong.
        </p>
      </header>

      <DesignSection
        title="Stack"
        description="What the design system is built on."
      >
        <Card>
          <CardContent className="grid gap-3 pt-6 text-sm sm:grid-cols-2">
            <Pair label="Framework" value="Next.js (App Router) + TypeScript" />
            <Pair label="CSS" value="Tailwind CSS v4" />
            <Pair label="Components" value="shadcn/ui (base-nova style)" />
            <Pair label="Primitives" value="Base UI (@base-ui/react)" />
            <Pair label="Icons" value="lucide-react" />
            <Pair label="Sans font" value="Manrope (body + nav)" />
            <Pair label="Display font" value="Noto Serif (headlines)" />
            <Pair label="Mono font" value="Geist Mono" />
            <Pair label="Brand color" value="Blue (oklch primary token)" />
            <Pair label="Theme" value="Light + dark via CSS variables" />
          </CardContent>
        </Card>
      </DesignSection>

      <DesignSection
        title="Identity"
        description="How Fixa shows up across surfaces."
      >
        <Card>
          <CardContent className="flex flex-col gap-6 pt-6">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Public wordmark
              </Label>
              <div className="text-2xl font-semibold tracking-tight">Fixa</div>
              <p className="text-sm text-muted-foreground">
                Manrope semibold, slight negative tracking. Marketing site,
                emails, signed-in product header.
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Admin wordmark
              </Label>
              <div className="text-2xl font-semibold tracking-tight">
                Fixa <span className="text-muted-foreground">·</span>{" "}
                <span className="text-muted-foreground">Admin</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Wordmark + middle-dot + muted &quot;Admin&quot;. The dark header
                background carries the rest of the visual distinction.
              </p>
            </div>
          </CardContent>
        </Card>
      </DesignSection>

      <DesignSection
        title="Color tokens"
        description="Semantic CSS variables defined in globals.css. Always reach for the token, never a hex code — the token auto-flips for dark mode."
      >
        <ColorGrid />
      </DesignSection>

      <DesignSection
        title="Typography"
        description="Noto Serif Bold for marketing headlines (hero, section titles) via `font-display`. Manrope for body text, nav, UI. Geist Mono for technical content (paths, IDs, env vars)."
      >
        <TypeScale />
      </DesignSection>

      <DesignSection
        title="Components"
        description="The shadcn primitives we've added so far. New ones come in via `pnpm dlx shadcn@latest add <name>`."
      >
        <ComponentShowcase />
      </DesignSection>

      <DesignSection
        title="Icons"
        description="Lucide. Always sized with Tailwind's size-* utilities, not width/height attributes."
      >
        <IconShowcase />
      </DesignSection>

      <DesignSection
        title="Spacing"
        description="Tailwind's default scale. Common patterns we reach for."
      >
        <SpacingNotes />
      </DesignSection>
    </div>
  );
}

function DesignSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

const colorTokens = [
  { name: "background", description: "Page background" },
  { name: "foreground", description: "Default text" },
  { name: "primary", description: "Key actions, default buttons" },
  { name: "primary-foreground", description: "Text on primary" },
  { name: "secondary", description: "Secondary surfaces" },
  { name: "secondary-foreground", description: "Text on secondary" },
  { name: "muted", description: "Subtle backgrounds, card tints" },
  { name: "muted-foreground", description: "Captions, descriptions" },
  { name: "accent", description: "Hover backgrounds" },
  { name: "accent-foreground", description: "Text on accent" },
  { name: "destructive", description: "Errors, dangerous actions" },
  { name: "border", description: "Card and input borders" },
  { name: "input", description: "Input borders" },
  { name: "ring", description: "Focus rings" },
  { name: "card", description: "Card backgrounds" },
  { name: "popover", description: "Dialog, dropdown surfaces" },
];

function ColorGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {colorTokens.map((token) => (
        <div
          key={token.name}
          className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
        >
          <div
            aria-hidden
            className="h-12 w-full rounded border border-border"
            style={{ background: `var(--${token.name})` }}
          />
          <div className="flex flex-col gap-0.5">
            <code className="text-xs font-medium">{token.name}</code>
            <span className="text-xs text-muted-foreground">
              {token.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TypeScale() {
  return (
    <Card>
      <CardContent className="flex flex-col divide-y divide-border pt-6">
        <TypeRow
          className="font-display text-6xl font-bold leading-[1.05] tracking-tight"
          label="font-display text-6xl (marketing hero)"
        >
          Editorial headline
        </TypeRow>
        <TypeRow
          className="font-display text-4xl font-bold leading-[1.05] tracking-tight"
          label="font-display text-4xl (marketing sections)"
        >
          Editorial section title
        </TypeRow>
        <TypeRow
          className="text-5xl font-semibold tracking-tight"
          label="text-5xl / semibold"
        >
          Headline 5xl
        </TypeRow>
        <TypeRow
          className="text-4xl font-semibold tracking-tight"
          label="text-4xl / semibold"
        >
          Headline 4xl
        </TypeRow>
        <TypeRow
          className="text-3xl font-semibold tracking-tight"
          label="text-3xl / semibold (page title)"
        >
          Page title
        </TypeRow>
        <TypeRow
          className="text-2xl font-semibold tracking-tight"
          label="text-2xl / semibold"
        >
          Headline 2xl
        </TypeRow>
        <TypeRow
          className="text-xl font-semibold tracking-tight"
          label="text-xl / semibold (section title)"
        >
          Section title
        </TypeRow>
        <TypeRow className="text-base" label="text-base / regular (body)">
          Body text. The default paragraph size. Used for most copy on the site.
        </TypeRow>
        <TypeRow
          className="text-sm text-muted-foreground"
          label="text-sm / muted (helper)"
        >
          Small text. Captions, descriptions, helper text.
        </TypeRow>
        <TypeRow
          className="text-xs font-semibold tracking-wider uppercase text-muted-foreground"
          label="text-xs / uppercase tracking-wider"
        >
          Eyebrow / label
        </TypeRow>
        <TypeRow className="font-mono text-sm" label="font-mono / text-sm">
          fixa-app/fixa · supabase/migrations/20260520150000.sql
        </TypeRow>
      </CardContent>
    </Card>
  );
}

function TypeRow({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <div className={className}>{children}</div>
      <code className="shrink-0 text-xs text-muted-foreground">{label}</code>
    </div>
  );
}

function ComponentShowcase() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buttons</CardTitle>
          <CardDescription>
            Variants control intent; sizes control fit. Default size is{" "}
            <code>default</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="default">Default</Button>
            <Button size="lg">LG</Button>
            <Button size="icon" aria-label="Settings">
              <Settings />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Badges</CardTitle>
          <CardDescription>
            Statuses, tags, dashboard state markers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>default</Badge>
            <Badge variant="secondary">secondary</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Form fields</CardTitle>
          <CardDescription>Labels paired with inputs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex max-w-sm flex-col gap-2">
            <Label htmlFor="design-input">Email</Label>
            <Input
              id="design-input"
              type="email"
              placeholder="you@example.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dialog</CardTitle>
          <CardDescription>
            Modal for focused interactions. Trigger via Base UI&apos;s{" "}
            <code>render</code> prop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger
              render={<Button variant="outline">Open dialog</Button>}
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>
                  A focused interaction. Closes on backdrop click or the X
                  button.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Separator</CardTitle>
          <CardDescription>Subtle divider between sections.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <span className="text-sm">Above</span>
          <Separator />
          <span className="text-sm">Below</span>
        </CardContent>
      </Card>
    </div>
  );
}

function IconShowcase() {
  const icons = [
    { Icon: Inbox, label: "Inbox" },
    { Icon: Calendar, label: "Calendar" },
    { Icon: FileText, label: "FileText" },
    { Icon: Wrench, label: "Wrench" },
    { Icon: Receipt, label: "Receipt" },
    { Icon: Users, label: "Users" },
    { Icon: Mail, label: "Mail" },
    { Icon: Settings, label: "Settings" },
    { Icon: CheckCircle2, label: "CheckCircle2" },
    { Icon: Workflow, label: "Workflow" },
  ];
  return (
    <Card>
      <CardContent className="flex flex-col gap-6 pt-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {icons.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-md border border-border bg-card p-4"
            >
              <Icon className="size-5 text-foreground/80" />
              <code className="text-xs">{label}</code>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Sizing:</strong> always use
            Tailwind&apos;s <code>size-*</code> utilities (
            <code>size-4</code> inline with text, <code>size-5</code> in
            buttons / cards, <code>size-6</code> for hero icons).
          </p>
          <p>
            <strong className="text-foreground">Color:</strong> inherit from the
            parent via <code>text-foreground/80</code>. Don&apos;t apply
            explicit colors unless the icon is the focal point.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const spacingExamples = [
  { token: "gap-1.5 / gap-2", use: "Inline elements, icon + text pairs" },
  { token: "gap-3", use: "Compact card content" },
  { token: "gap-4 / gap-6", use: "Card sections, form rows" },
  { token: "gap-8 / gap-10", use: "Page-level vertical rhythm" },
  { token: "gap-12", use: "Major section separation (this page)" },
  { token: "py-10 / py-12", use: "Top/bottom padding for app pages" },
  { token: "py-20 / py-24", use: "Marketing landing sections" },
  { token: "px-6", use: "Horizontal page padding (mobile-safe)" },
  { token: "max-w-4xl", use: "Reading width (plan pages)" },
  { token: "max-w-6xl / max-w-7xl", use: "App / admin pages" },
];

function SpacingNotes() {
  return (
    <Card>
      <CardContent className="pt-6">
        <ul className="flex flex-col divide-y divide-border">
          {spacingExamples.map(({ token, use }) => (
            <li
              key={token}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <code className="font-mono text-sm">{token}</code>
              <span className="text-sm text-muted-foreground">{use}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
