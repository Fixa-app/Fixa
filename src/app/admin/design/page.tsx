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
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  FileText,
  Inbox,
  Mail,
  Paintbrush,
  Pencil,
  Plus,
  Receipt,
  Settings,
  Users,
  Workflow,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { AuthDialog } from "@/components/auth-dialog";
import { FAQAccordion } from "@/components/faq-accordion";
import { IndustriesCarousel } from "@/components/industries-carousel";
import { PricingCalculator } from "@/components/pricing-calculator";
import { ProductAccordion } from "@/components/product-accordion";
import { ReferralsCards } from "@/components/referrals-cards";
import { WhyFixaCards } from "@/components/why-fixa-cards";

export default function DesignPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-12 sm:py-16 lg:px-5">
      <PageHeader />
      <Section eyebrow="01" title="Stack">
        <StackGrid />
      </Section>
      <Section eyebrow="02" title="Identity">
        <IdentityRows />
      </Section>
      <Section eyebrow="03" title="Color">
        <ColorPalette />
      </Section>
      <Section eyebrow="04" title="Typography">
        <TypeScale />
      </Section>
      <Section eyebrow="05" title="Components">
        <ComponentShowcase />
      </Section>
      <Section eyebrow="06" title="Homepage building blocks">
        <HomepageShowcase />
      </Section>
      <Section eyebrow="07" title="Icons">
        <IconShowcase />
      </Section>
      <Section eyebrow="08" title="Spacing">
        <SpacingTable />
      </Section>
      <Section eyebrow="09" title="Breakpoints">
        <BreakpointTable />
      </Section>
    </div>
  );
}

/* ----------------------------- Page chrome ----------------------------- */

function PageHeader() {
  return (
    <header className="flex flex-col gap-4 pb-12">
      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Fixa
      </p>
      <h1 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
        Design system
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
        Living reference for how Fixa looks and feels. Use this as the source
        of truth when adding new UI — staying close to these patterns means new
        screens feel like they belong.
      </p>
    </header>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8 border-t border-border py-12 sm:py-16">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl leading-[1.05] font-medium tracking-tight">
          {title}
        </h2>
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
  { label: "Brand colors", value: "Flame Orange + Stormy Teal + Midnight Violet" },
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
        label="Logo"
        sample={
          <Image
            src="/fixa-logo.svg"
            alt="Fixa"
            width={120}
            height={48}
            className="h-10 w-auto"
          />
        }
        note="The Fixa mark. Use on light surfaces; invert on dark backgrounds (e.g. the marketing header)."
      />
      <IdentityRow
        label="Wordmark"
        sample={
          <span className="text-3xl font-semibold tracking-tight">Fixa</span>
        }
        note="Manrope semibold, slight negative tracking. For text contexts — emails, footers, places the logo doesn't fit."
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
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="rounded-3xl border border-border bg-card p-8">
        {sample}
      </div>
      <p className="text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

/* ----------------------------- Color ----------------------------- */

type Swatch = {
  name: string;
  hex: string;
  use: string;
  textOn?: string;
};

const palette: Swatch[] = [
  {
    name: "background",
    hex: "#F6F6F3",
    use: "Page background — fresh off-white",
    textOn: "var(--foreground)",
  },
  {
    name: "hover",
    hex: "#ECEBE6",
    use: "Hover surface — slightly darker than the background",
    textOn: "var(--foreground)",
  },
  {
    name: "section surface",
    hex: "#E4E3DE",
    use: "Grouped sections / panels — between page and card",
    textOn: "var(--foreground)",
  },
  {
    name: "foreground / secondary",
    hex: "#1F1A14",
    use: "Body text & headlines; also secondary buttons, badges & dark header",
    textOn: "var(--background)",
  },
  {
    name: "primary",
    hex: "#FC5201",
    use: "Flame Orange — CTAs, brand anchor, hero moments",
    textOn: "var(--primary-foreground)",
  },
  {
    name: "teal",
    hex: "#0D424E",
    use: "Stormy Teal — WhyFixa reasons card",
    textOn: "var(--teal-foreground)",
  },
  {
    name: "violet",
    hex: "#3A2A66",
    use: "Midnight Violet — pricing card, premium accents",
    textOn: "var(--violet-foreground)",
  },
  {
    name: "burgundy",
    hex: "#5E1A33",
    use: "Burgundy — deep accent",
    textOn: "var(--burgundy-foreground)",
  },
  {
    name: "primary-dark",
    hex: "#9C2D05",
    use: "Deep orange — primary hover & dark accents",
    textOn: "#ffffff",
  },
  {
    name: "footer",
    hex: "#271C0A",
    use: "Footer & large dark surfaces — warm near-black (surface-dark)",
    textOn: "#ffffff",
  },
  {
    name: "teal-bright",
    hex: "#0D9488",
    use: "Bright teal — accents & badges on light surfaces",
    textOn: "var(--teal-bright-foreground)",
  },
  {
    name: "violet-bright",
    hex: "#6B47CC",
    use: "Bright violet — accents & badges on light surfaces",
    textOn: "var(--violet-bright-foreground)",
  },
  {
    name: "burgundy-bright",
    hex: "#BE123C",
    use: "Bright burgundy — accents & badges on light surfaces",
    textOn: "var(--burgundy-bright-foreground)",
  },
];

function ColorPalette() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {palette.map((s) => {
          const isTokenBg = ["background", "foreground", "primary", "teal", "violet", "burgundy", "secondary"].includes(s.name);
          return (
            <div key={s.name} className="flex flex-col gap-2">
              <div
                className="flex h-28 w-full items-end justify-between rounded-2xl border border-border p-3"
                style={{
                  background: isTokenBg ? `var(--${s.name})` : s.hex,
                  color: s.textOn ?? "var(--foreground)",
                }}
              >
                <span className="text-sm font-semibold">Aa</span>
                <code className="text-xs tracking-tight uppercase opacity-80">
                  {s.hex}
                </code>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{s.name}</span>
                <span className="text-sm leading-snug text-muted-foreground">
                  {s.use}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Brand tokens ship with a paired <code>-foreground</code> for text on
        top (e.g. <code>bg-teal text-teal-foreground</code>). The full
        semantic shadcn set (muted, accent, border, ring, popover, …) lives
        in <code>globals.css</code> and powers the primitives below.
      </p>
    </div>
  );
}

/* ----------------------------- Typography ----------------------------- */

type TypeGroup = "Display" | "Heading" | "Body";

const typeGroups: { name: TypeGroup; note: string }[] = [
  {
    name: "Display",
    note: "Stand-alone only — at most one display element per section, never several. Page headers, pop-up headers, hero moments.",
  },
  {
    name: "Heading",
    note: "Repeated content headings that sit alongside the single display — card titles, features, list items.",
  },
  {
    name: "Body",
    note: "Body copy and supporting text — paragraphs, nav links, labels, captions, eyebrows.",
  },
];

type TypeRow = {
  group: TypeGroup;
  name: string;
  sample: string;
  className: string;
  font: string;
  size: string;
  weight: string;
  tracking: string;
};

const typeRows: TypeRow[] = [
  {
    group: "Display",
    name: "Hero display",
    sample: "Minder papierwerk, meer vakwerk",
    className: "font-display text-6xl font-bold leading-[1.05] tracking-tight",
    font: "Display · Sora",
    size: "text-5xl → 7xl (responsive)",
    weight: "Bold",
    tracking: "Tight",
  },
  {
    group: "Display",
    name: "Display",
    sample: "Eén systeem, van aanvraag tot betaling",
    className: "font-display text-5xl font-medium leading-[1.05] tracking-tight",
    font: "Display · Sora",
    size: "text-4xl → 5xl",
    weight: "Medium",
    tracking: "Tight",
  },
  {
    group: "Display",
    name: "Small display — page header",
    sample: "Overzicht",
    className: "font-display text-3xl font-medium leading-[1.05] tracking-tight",
    font: "Display · Sora",
    size: "text-3xl · 30px",
    weight: "Medium",
    tracking: "Tight",
  },
  {
    group: "Display",
    name: "Mini display — pop-up header",
    sample: "Welkom bij Fixa",
    className: "font-display text-2xl font-medium leading-tight tracking-tight",
    font: "Display · Sora",
    size: "text-2xl · 24px",
    weight: "Medium",
    tracking: "Tight",
  },
  {
    group: "Heading",
    name: "Heading",
    sample: "Offertes in een minuut",
    className: "text-2xl font-semibold tracking-tight",
    font: "Sans · Manrope",
    size: "text-2xl · 24px",
    weight: "Semibold",
    tracking: "Tight",
  },
  {
    group: "Heading",
    name: "Subheading",
    sample: "Wat kost Fixa?",
    className: "text-xl font-semibold tracking-tight",
    font: "Sans · Manrope",
    size: "text-lg → xl (18–20px)",
    weight: "Semibold",
    tracking: "Tight",
  },
  {
    group: "Body",
    name: "Label",
    sample: "Field label",
    className: "text-sm font-semibold text-foreground",
    font: "Sans · Manrope",
    size: "text-sm · 14px",
    weight: "Semibold",
    tracking: "Normal",
  },
  {
    group: "Body",
    name: "Body",
    sample: "Body text. The default paragraph size used across most copy.",
    className: "text-base",
    font: "Sans · Manrope",
    size: "text-base · 16px",
    weight: "Normal",
    tracking: "Normal",
  },
  {
    group: "Body",
    name: "Caption",
    sample: "Small text. Captions, descriptions, helper copy.",
    className: "text-sm text-muted-foreground",
    font: "Sans · Manrope",
    size: "text-sm · 14px",
    weight: "Normal",
    tracking: "Normal",
  },
  {
    group: "Body",
    name: "Nav link",
    sample: "Voor wie · Product · Prijzen",
    className: "text-base font-bold",
    font: "Sans · Manrope",
    size: "text-base · 16px",
    weight: "Bold",
    tracking: "Normal",
  },
  {
    group: "Body",
    name: "Eyebrow / label",
    sample: "Eyebrow / label",
    className:
      "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
    font: "Sans · Manrope",
    size: "text-xs · 12px",
    weight: "Semibold",
    tracking: "Wider · uppercase",
  },
];

function TypeScale() {
  return (
    <div className="flex flex-col gap-12">
      {typeGroups.map((group) => (
        <div key={group.name} className="flex flex-col">
          <div className="flex flex-col gap-1 pb-4">
            <h3 className="text-xl font-semibold tracking-tight">
              {group.name}
            </h3>
            <p className="max-w-2xl text-base text-muted-foreground">
              {group.note}
            </p>
          </div>
          {typeRows
            .filter((row) => row.group === group.name)
            .map((row) => (
              <div
                key={row.name}
                className="flex flex-col gap-3 border-b border-border py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
              >
                <div className={`min-w-0 ${row.className}`}>{row.sample}</div>
                <div className="shrink-0 sm:w-64 sm:text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {row.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {row.font} · {row.size} · {row.weight} · {row.tracking}
                  </p>
                </div>
              </div>
            ))}
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
        note="Four styles — Primary (orange), Secondary (black), Tertiary (outline), Text link (black, at the button's text size). Two sizes: main + small."
      >
        <div className="flex flex-col gap-6">
          {/* The four styles — main size */}
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Tertiary</Button>
            <Button variant="link">Text link</Button>
            <Button variant="link" className="gap-1">
              Text link
              <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* Small size */}
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="outline">
              Tertiary
            </Button>
            <Button size="sm" variant="link">
              Text link
            </Button>
          </div>

        </div>
      </ComponentBlock>

      <ComponentBlock
        title="Navigation links"
        note="Inline links use the Nav link style (text-base font-bold). Menu items pair an icon with the label — industries menu, dashboard sidebar, account dropdown."
      >
        <div className="flex flex-col gap-6">
          {/* Inline nav links (marketing header) */}
          <div className="flex flex-wrap items-center gap-6">
            {["Bedrijfstypen", "Product", "Prijzen"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-base font-bold text-foreground transition-colors hover:text-foreground/70"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Icon + nav link (industries menu / sidebar) */}
          <div className="flex flex-wrap items-center gap-6">
            {[
              { icon: Wrench, label: "Loodgieters" },
              { icon: Zap, label: "Elektriciens" },
              { icon: Paintbrush, label: "Schilders" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className="inline-flex items-center gap-3 text-base font-bold text-foreground transition-colors hover:text-foreground/70"
              >
                <Icon className="size-5" strokeWidth={2} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </ComponentBlock>

      <ComponentBlock
        title="Form fields"
        note="White fill, no outline at rest — only a primary (Flame Orange) border on focus. Shown on a surface inset since the field is white."
      >
        <div className="max-w-sm rounded-2xl bg-background p-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="design-input" className="text-sm font-semibold">
              E-mailadres
            </Label>
            <Input
              id="design-input"
              type="email"
              placeholder="jij@voorbeeld.nl"
              className="h-12 rounded-xl text-base"
            />
          </div>
        </div>
      </ComponentBlock>

      <ComponentBlock
        title="Onboarding form"
        note="Detail card used across the onboarding flow — reduced-weight label over the heavy value, with a per-row action: grey edit (pencil) when filled, solid primary add (plus) when empty. White cards on a surface; the whole card lightens on hover."
      >
        <div className="flex max-w-md flex-col gap-3 rounded-2xl bg-background p-5">
          <div className="group flex w-full items-center gap-4 rounded-xl bg-card p-5 text-left transition-all hover:bg-hover">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-muted-foreground">
                Bedrijf
              </div>
              <p className="mt-1 truncate text-base font-bold text-foreground">
                Maikel Miltenburg Hoveniers
              </p>
            </div>
            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-colors group-hover:bg-muted/80">
              <Pencil className="size-4" strokeWidth={2} />
            </div>
          </div>
          <div className="group flex w-full items-center gap-4 rounded-xl bg-card p-5 text-left transition-all hover:bg-hover">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-muted-foreground">
                KVK-nummer
              </div>
              <p className="mt-1 truncate text-base font-medium text-muted-foreground">
                Nog niet ingevuld
              </p>
            </div>
            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-colors group-hover:bg-primary/90">
              <Plus className="size-6" strokeWidth={3} />
            </div>
          </div>
        </div>
      </ComponentBlock>

      <ComponentBlock
        title="Badges"
        note="Statuses, tags, dashboard state markers. Bold, fill only (no outline), colored from the brand palette."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="teal">Teal</Badge>
          <Badge variant="violet">Violet</Badge>
          <Badge variant="burgundy">Burgundy</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </ComponentBlock>

      <ComponentBlock
        title="Dialog"
        note="rounded-3xl bg-background p-6 sm:max-w-md. Title uses Mini display (font-display text-2xl)."
      >
        <Dialog>
          <DialogTrigger
            render={
              <Button className="h-12 rounded-xl px-6 text-base font-bold">
                Open dialog
              </Button>
            }
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

      <ComponentBlock
        title="Pop-up"
        note="The modal surface — rounded-3xl bg-background p-6, max-w-md, with a close affordance. Title uses Mini display. Shown statically here; trigger it live via Dialog or the Auth dialog."
      >
        <div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-xl">
          <button
            type="button"
            aria-label="Sluiten"
            className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
          <div className="flex flex-col gap-2 pr-8">
            <h3 className="font-display text-2xl font-medium tracking-tight">
              Pop-up titel
            </h3>
            <p className="text-base text-muted-foreground">
              Een gerichte interactie. Sluit via de achtergrond of de X-knop.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="link" className="text-foreground">
              Annuleren
            </Button>
            <Button>Bevestigen</Button>
          </div>
        </div>
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

/* ----------------------------- Homepage building blocks ----------------------------- */

const sampleIndustries = [
  {
    name: "Loodgieters",
    body: "Vang noodgevallen op, plan onderhoud en factureer direct vanaf de werkplek.",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80",
  },
  {
    name: "Elektriciens",
    body: "Werk slim met digitale werkbonnen, materiaalbeheer en directe oplevering.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
  },
  {
    name: "CV & klimaat",
    body: "Beheer onderhoudscontracten, plan servicebezoeken en houd elke installatie bij.",
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=80",
  },
  {
    name: "Hoveniers",
    body: "Plan seizoenswerk, factureer uren en materialen, en blijf groeien zonder admin.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
];

function HomepageShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <ComponentBlock
        title="Auth dialog"
        note="Combined login/signup with magic-link email and Google fallback. Trigger via any child component."
      >
        <AuthDialog>
          <Button>Open auth dialog</Button>
        </AuthDialog>
      </ComponentBlock>

      <ComponentBlock
        title="Product accordion"
        note="Expanding feature list. Active row + mockup pane use bg-card. Inline mockup appears under Lees meer below lg."
      >
        <ProductAccordion />
      </ComponentBlock>

      <ComponentBlock
        title="Industries carousel"
        note="Horizontal snap-scroller. Cards reveal body + arrow on hover; first card auto-reveals below lg in marketing context (disabled here)."
      >
        <IndustriesCarousel cards={sampleIndustries} />
      </ComponentBlock>

      <ComponentBlock
        title="Referrals cards"
        note="Expand-on-hover on desktop. First tap on a collapsed mobile card expands; second tap navigates to /testimonials/<slug>."
      >
        <ReferralsCards />
      </ComponentBlock>

      <ComponentBlock
        title="Why Fixa cards"
        note="Auto-cycling visual + reasons (5s). Mobile fuses the two halves into one card and shows only the active reason."
      >
        <WhyFixaCards />
      </ComponentBlock>

      <ComponentBlock
        title="Pricing calculator"
        note="Slider with floating value bubble. Designed to sit inside a violet card surface — wrap accordingly in marketing pages."
      >
        <div className="rounded-3xl bg-violet p-8 text-white md:p-12">
          <PricingCalculator />
        </div>
      </ComponentBlock>

      <ComponentBlock
        title="FAQ accordion"
        note="Plus/minus toggle. Hover state matches the open-row surface for a soft preview."
      >
        <FAQAccordion />
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
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-base text-muted-foreground">{note}</p>
      </div>
      <div className="rounded-3xl bg-card p-6 sm:p-8">{children}</div>
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
            <span className="text-sm font-semibold">{label}</span>
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
          <span className="text-sm font-semibold">{token}</span>
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
          <span className="font-semibold">{bp.name}</span>
          <code className="text-muted-foreground">{bp.min}</code>
          <span className="text-muted-foreground">{bp.use}</span>
        </div>
      ))}
    </div>
  );
}
