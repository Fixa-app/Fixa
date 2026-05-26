import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
    <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-16">
      <PageHeader />
      <TypographyHero />
      <Section
        eyebrow="01"
        title="Stack"
        description="What the design system is built on."
      >
        <StackGrid />
      </Section>
      <Section
        eyebrow="02"
        title="Identity"
        description="How Fixa shows up across surfaces."
      >
        <IdentityRows />
      </Section>
      <Section
        eyebrow="03"
        title="Color"
        description="Semantic CSS variables. Always reach for the token, never a hex code — tokens auto-flip for dark mode."
      >
        <ColorPalette />
      </Section>
      <Section
        eyebrow="04"
        title="Typography"
        description="Three fonts: Sora for headings, Manrope for body and nav, Geist Mono for technical content."
      >
        <TypeScale />
      </Section>
      <Section
        eyebrow="05"
        title="Components"
        description="The shadcn primitives we've added so far. New ones come in via pnpm dlx shadcn add."
      >
        <ComponentShowcase />
      </Section>
      <Section
        eyebrow="06"
        title="Icons"
        description="Lucide. Always sized with Tailwind's size-* utilities, never width/height attributes."
      >
        <IconShowcase />
      </Section>
      <Section
        eyebrow="07"
        title="Spacing"
        description="Tailwind's default scale. Patterns we reach for."
      >
        <SpacingTable />
      </Section>
      <Section
        eyebrow="08"
        title="Breakpoints"
        description="Tailwind's default screen sizes. Mobile first — base styles target the smallest viewport."
      >
        <BreakpointTable />
      </Section>
    </div>
  );
}

/* ----------------------------- Page chrome ----------------------------- */

function PageHeader() {
  return (
    <header className="flex flex-col gap-3 pb-12">
      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Fixa
      </p>
      <h1 className="font-display text-5xl font-medium tracking-tight sm:text-6xl">
        Design system
      </h1>
      <p className="max-w-2xl text-base text-muted-foreground">
        Living reference for how Fixa looks and feels. Use this as the source
        of truth when adding new UI — staying close to these patterns means new
        screens feel like they belong.
      </p>
    </header>
  );
}

function TypographyHero() {
  return (
    <div className="flex flex-col gap-4 border-t border-border py-16 sm:py-20">
      <p className="font-display text-4xl leading-[1.1] tracking-tight sm:text-6xl">
        Eén workflow van het telefoontje tot de betaling.
      </p>
      <p className="max-w-xl text-base text-muted-foreground">
        The display font carries the brand voice. Use it for editorial
        moments — hero headlines, section titles on marketing. Never for body
        copy.
      </p>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-10 border-t border-border py-16 sm:grid-cols-[220px_1fr] sm:gap-16">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl font-medium tracking-tight">
          {title}
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

/* ----------------------------- Stack ----------------------------- */

const stackItems = [
  { label: "Framework", value: "Next.js (App Router) + TypeScript" },
  { label: "CSS", value: "Tailwind CSS v4" },
  { label: "Components", value: "shadcn/ui (base-nova style)" },
  { label: "Primitives", value: "Base UI (@base-ui/react)" },
  { label: "Icons", value: "lucide-react" },
  { label: "Display font", value: "Sora (headings)" },
  { label: "Sans font", value: "Manrope (body + nav)" },
  { label: "Mono font", value: "Geist Mono" },
  { label: "Brand colors", value: "Digital Blue + Violet + Tangerine + Mint" },
  { label: "Theme", value: "Light + dark via CSS variables" },
];

function StackGrid() {
  return (
    <ul className="grid gap-x-12 gap-y-3 sm:grid-cols-2">
      {stackItems.map((item) => (
        <li
          key={item.label}
          className="flex items-baseline justify-between gap-4 border-b border-border pb-2 text-sm"
        >
          <span className="text-muted-foreground">{item.label}</span>
          <span className="text-right font-medium">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------- Identity ----------------------------- */

function IdentityRows() {
  return (
    <div className="flex flex-col gap-8">
      <IdentityRow
        label="Public wordmark"
        sample={
          <span className="text-3xl font-semibold tracking-tight">Fixa</span>
        }
        note="Manrope semibold, slight negative tracking. Marketing site, emails, signed-in product header."
      />
      <IdentityRow
        label="Admin wordmark"
        sample={
          <span className="text-3xl font-semibold tracking-tight">
            Fixa <span className="text-muted-foreground">·</span>{" "}
            <span className="text-muted-foreground">Admin</span>
          </span>
        }
        note="Wordmark + middle-dot + muted 'Admin'. Dark header background carries the rest of the distinction."
      />
    </div>
  );
}

function IdentityRow({
  label,
  sample,
  note,
}: {
  label: string;
  sample: React.ReactNode;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <div className="rounded-2xl border border-border bg-card p-8">
        {sample}
      </div>
      <p className="text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

/* ----------------------------- Color ----------------------------- */

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

function ColorPalette() {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {colorTokens.map((token) => (
          <div key={token.name} className="flex flex-col gap-2">
            <div
              aria-hidden
              className="h-20 w-full rounded-xl border border-border"
              style={{ background: `var(--${token.name})` }}
            />
            <div className="flex flex-col gap-0.5">
              <code className="text-xs font-semibold">--{token.name}</code>
              <span className="text-xs text-muted-foreground">
                {token.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Brand surfaces
          </h3>
          <p className="text-sm text-muted-foreground">
            Named brand colors for marketing sections. Each ships with a paired
            foreground token — use them together (bg-ink + text-ink-foreground).
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {brandSurfaces.map((s) => (
            <div key={s.name} className="flex flex-col gap-2">
              <div
                className="flex h-28 w-full items-end justify-between rounded-xl border border-border p-3"
                style={{
                  background: `var(--${s.name})`,
                  color: `var(--${s.name}-foreground)`,
                }}
              >
                <span className="text-sm font-semibold">Aa</span>
                <code className="font-mono text-[10px] tracking-tight uppercase opacity-80">
                  {s.hex}
                </code>
              </div>
              <div className="flex flex-col gap-0.5">
                <code className="text-xs font-semibold">--{s.name}</code>
                <span className="text-xs text-muted-foreground">{s.use}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const brandSurfaces = [
  {
    name: "primary",
    hex: "#016AFF",
    use: "Digital Blue — core CTAs, links, brand anchor",
  },
  {
    name: "violet",
    hex: "#7C3AED",
    use: "Blue Violet — Assist AI, premium / smart features only",
  },
  {
    name: "tangerine",
    hex: "#F97316",
    use: "Pumpkin Spice — energy, urgency, time-sensitive states",
  },
  {
    name: "mint",
    hex: "#10B981",
    use: "Mint Leaf — paid, approved, completed states",
  },
  {
    name: "ink",
    hex: "#1F1A14",
    use: "Warm charcoal — body text, headlines, dark surfaces",
  },
  {
    name: "cream",
    hex: "#F5EDDC",
    use: "Lifted card surface, marketing sections",
  },
];

/* ----------------------------- Typography ----------------------------- */

const typeRows = [
  {
    sample: "Headline 6xl",
    className: "font-display text-6xl font-medium leading-[1.05] tracking-tight",
    spec: "font-display · text-6xl · font-medium",
  },
  {
    sample: "Headline 4xl",
    className: "font-display text-4xl font-medium leading-[1.1] tracking-tight",
    spec: "font-display · text-4xl · font-medium",
  },
  {
    sample: "Page title",
    className: "text-3xl font-semibold tracking-tight",
    spec: "text-3xl · font-semibold",
  },
  {
    sample: "Section title",
    className: "text-xl font-semibold tracking-tight",
    spec: "text-xl · font-semibold",
  },
  {
    sample: "Body text. The default paragraph size used across most copy.",
    className: "text-base",
    spec: "text-base · font-normal",
  },
  {
    sample: "Small text. Captions, descriptions, helper copy.",
    className: "text-sm text-muted-foreground",
    spec: "text-sm · text-muted-foreground",
  },
  {
    sample: "Voor wie · Product · Prijzen",
    className: "text-base font-bold",
    spec: "text-base · font-bold (nav link)",
  },
  {
    sample: "Eyebrow / label",
    className:
      "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
    spec: "text-xs · font-semibold · tracking-wider · uppercase",
  },
  {
    sample: "fixa-app/fixa · supabase/migrations/2026...sql",
    className: "font-mono text-sm",
    spec: "font-mono · text-sm",
  },
];

function TypeScale() {
  return (
    <div className="flex flex-col">
      {typeRows.map((row, i) => (
        <div
          key={i}
          className="flex flex-col gap-1 border-b border-border py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
        >
          <div className={row.className}>{row.sample}</div>
          <code className="shrink-0 font-mono text-xs text-muted-foreground">
            {row.spec}
          </code>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- Components ----------------------------- */

function ComponentShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <ComponentBlock
        title="Buttons"
        note="Variants control intent; sizes control fit. Default size is `default`."
      >
        <div className="flex flex-col gap-4">
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
            <Button className="rounded-full px-5">Pill (marketing)</Button>
          </div>
        </div>
      </ComponentBlock>

      <ComponentBlock
        title="Badges"
        note="Statuses, tags, dashboard state markers."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge>default</Badge>
          <Badge variant="secondary">secondary</Badge>
        </div>
      </ComponentBlock>

      <ComponentBlock title="Form fields" note="Labels paired with inputs.">
        <div className="flex max-w-sm flex-col gap-2">
          <Label htmlFor="design-input">Email</Label>
          <Input
            id="design-input"
            type="email"
            placeholder="you@example.com"
          />
        </div>
      </ComponentBlock>

      <ComponentBlock
        title="Dialog"
        note="Modal for focused interactions. Trigger via Base UI's render prop."
      >
        <Dialog>
          <DialogTrigger
            render={<Button variant="outline">Open dialog</Button>}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>
                A focused interaction. Closes on backdrop click or the X button.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </ComponentBlock>

      <ComponentBlock title="Separator" note="Subtle divider between sections.">
        <div className="flex flex-col gap-3">
          <span className="text-sm">Above</span>
          <Separator />
          <span className="text-sm">Below</span>
        </div>
      </ComponentBlock>
    </div>
  );
}

function ComponentBlock({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{note}</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        {children}
      </div>
    </div>
  );
}

/* ----------------------------- Icons ----------------------------- */

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

function IconShowcase() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {icons.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4"
          >
            <Icon className="size-5 text-foreground/80" />
            <code className="text-xs">{label}</code>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Sizing:</strong> Tailwind's{" "}
          <code>size-*</code> utilities (<code>size-4</code> inline,{" "}
          <code>size-5</code> in buttons/cards, <code>size-6</code> for hero
          icons).
        </p>
        <p>
          <strong className="text-foreground">Color:</strong> inherit via{" "}
          <code>text-foreground/80</code>. Don't apply explicit colors unless
          the icon is the focal point.
        </p>
      </div>
    </div>
  );
}

/* ----------------------------- Spacing ----------------------------- */

const spacingExamples = [
  { token: "gap-1.5 / gap-2", use: "Inline elements, icon + text pairs" },
  { token: "gap-3", use: "Compact card content" },
  { token: "gap-4 / gap-6", use: "Card sections, form rows" },
  { token: "gap-8 / gap-10", use: "Page-level vertical rhythm" },
  { token: "gap-12 / gap-16", use: "Major section separation" },
  { token: "py-10 / py-12", use: "Top/bottom padding for app pages" },
  { token: "py-20 / py-24", use: "Marketing landing sections" },
  { token: "px-6", use: "Horizontal page padding (mobile-safe)" },
  { token: "max-w-4xl", use: "Reading width (plan pages)" },
  { token: "max-w-6xl / max-w-7xl", use: "App / admin / marketing pages" },
];

function SpacingTable() {
  return (
    <div className="flex flex-col">
      {spacingExamples.map(({ token, use }) => (
        <div
          key={token}
          className="flex flex-col gap-1 border-b border-border py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
        >
          <code className="font-mono text-sm font-semibold">{token}</code>
          <span className="text-sm text-muted-foreground">{use}</span>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- Breakpoints ----------------------------- */

const breakpoints = [
  { name: "base", min: "< 640px", use: "Mobile (default — no prefix needed)" },
  { name: "sm", min: "≥ 640px", use: "Large phones, small tablets" },
  { name: "md", min: "≥ 768px", use: "Tablets — header nav becomes visible" },
  { name: "lg", min: "≥ 1024px", use: "Laptops — multi-column grids open up" },
  { name: "xl", min: "≥ 1280px", use: "Desktop — rare; use sparingly" },
  { name: "2xl", min: "≥ 1536px", use: "Ultrawide — almost never" },
];

function BreakpointTable() {
  return (
    <div className="flex flex-col">
      {breakpoints.map((bp) => (
        <div
          key={bp.name}
          className="grid grid-cols-[80px_120px_1fr] gap-4 border-b border-border py-3 text-sm"
        >
          <code className="font-mono font-semibold">{bp.name}</code>
          <code className="font-mono text-muted-foreground">{bp.min}</code>
          <span className="text-muted-foreground">{bp.use}</span>
        </div>
      ))}
    </div>
  );
}
