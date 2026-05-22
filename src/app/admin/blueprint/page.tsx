import {
  ArrowRight,
  BarChart3,
  Bell,
  BellRing,
  BookOpen,
  Calendar,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileText,
  Globe,
  Inbox,
  type LucideIcon,
  MessageSquare,
  Plus,
  Receipt,
  Repeat,
  Search,
  User,
  UserCog,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Surface = "Pro" | "Client" | "Online";

type CardData = {
  name: string;
  icon: LucideIcon;
  surface: Surface;
  description: string;
  statuses?: string[];
  userStories?: string[];
};

/* --------------------------- Cards --------------------------- */

const newRequestPro: CardData = {
  name: "New request",
  icon: Plus,
  surface: "Pro",
  description: "Quick-add a new request manually from inside Fixa.",
  userStories: [
    "As a pro, I want to capture a request while I'm still on the phone with a client.",
    "As a pro, I want to link the request to an existing customer or create a new one in the same flow.",
  ],
};

const websitePro: CardData = {
  name: "Website",
  icon: Globe,
  surface: "Pro",
  description: "Public form on the pro's website that creates a new request.",
  userStories: [
    "As a pro, I want clients to submit requests via my website so I don't lose leads after hours.",
    "As a pro, I want submitted requests to land in my Requests inbox automatically.",
    "As a pro, I want to customize what fields the form asks for.",
  ],
};

const requestsPro: CardData = {
  name: "Requests",
  icon: Inbox,
  surface: "Pro",
  description: "Triage incoming work. Decide whether to quote.",
  statuses: ["New", "Intake scheduled", "Intake done", "Overdue"],
  userStories: [
    "As a pro, I want to see all incoming requests in one inbox so nothing slips through.",
    "As a pro, I want to triage requests (qualify, schedule intake, decline) with one click.",
    "As a pro, I want to convert a qualified request into a quote without re-entering data.",
  ],
};

const intakesPro: CardData = {
  name: "Intakes",
  icon: CalendarCheck,
  surface: "Pro",
  description: "On-location assessments before quoting.",
  statuses: ["Proposed", "Confirmed", "Completed", "Refused"],
  userStories: [
    "As a pro, I want to propose timeslots to clients for an on-location assessment.",
    "As a pro, I want to capture photos and notes during the intake visit.",
    "As a pro, I want to mark intake done so the request becomes quotable.",
  ],
};

const quotesPro: CardData = {
  name: "Quotes",
  icon: FileText,
  surface: "Pro",
  description: "Compose, share, iterate until accepted.",
  statuses: ["Draft", "Waiting for response", "Change requested", "Approved"],
  userStories: [
    "As a pro, I want to compose quotes with line items, taxes, and discounts.",
    "As a pro, I want to know when the client viewed the quote.",
    "As a pro, I want to iterate on a quote when the client requests changes.",
  ],
};

const servicePlansPro: CardData = {
  name: "Service plans",
  icon: Repeat,
  surface: "Pro",
  description:
    "Recurring service contracts — maintenance, monthly checks, subscriptions.",
  statuses: ["Draft", "Active", "Paused", "Cancelled"],
  userStories: [
    "As a pro, I want to set up recurring contracts so I have predictable revenue.",
    "As a pro, I want Fixa to auto-generate work orders from active plans on schedule.",
    "As a pro, I want to pause a plan without cancelling it (e.g. summer break).",
  ],
};

const jobsPro: CardData = {
  name: "Jobs",
  icon: Wrench,
  surface: "Pro",
  description: "Schedule, dispatch, execute the accepted work.",
  statuses: [
    "Unscheduled",
    "In progress",
    "Late",
    "Action required",
    "Completed",
  ],
  userStories: [
    "As a pro, I want to schedule a job on a specific date with the right crew.",
    "As a pro, I want to dispatch the team with route info, materials, and client details.",
    "As a pro, I want to mark the job complete and have an invoice draft created automatically.",
  ],
};

const schedule: CardData = {
  name: "Schedule",
  icon: Calendar,
  surface: "Pro",
  description: "Central calendar for intakes and jobs.",
  userStories: [
    "As a pro, I want to see all upcoming intakes and jobs on one calendar.",
    "As a pro, I want to drag-and-drop to reschedule without breaking client communications.",
    "As a pro, I want to filter the view by team member or job type.",
  ],
};

const inboxPro: CardData = {
  name: "Inbox",
  icon: Bell,
  surface: "Pro",
  description: "Centralised messages from clients, suppliers, and team.",
  statuses: ["New", "Read", "Snoozed", "Archived"],
  userStories: [
    "As a pro, I want all client/supplier/team messages in one inbox so I stop tab-switching.",
    "As a pro, I want to snooze a message until I'm at my desk to handle it.",
    "As a pro, I want to assign a message to a teammate without forwarding.",
  ],
};

const invoicesPro: CardData = {
  name: "Invoices",
  icon: Receipt,
  surface: "Pro",
  description: "Bill, remind, get paid, close the loop.",
  statuses: ["Draft", "Sent", "Late", "Paid"],
  userStories: [
    "As a pro, I want to generate invoices from completed jobs automatically.",
    "As a pro, I want to send reminders to clients who haven't paid.",
    "As a pro, I want to see overdue invoices at a glance.",
  ],
};

const accountingPro: CardData = {
  name: "Accounting",
  icon: BookOpen,
  surface: "Pro",
  description:
    "Sync invoices, payments, and customers to the pro's bookkeeping software.",
  statuses: ["Connected", "Syncing", "Error", "Disconnected"],
  userStories: [
    "As a pro, I want Fixa to push invoices and payments to my bookkeeping tool so I don't double-enter.",
    "As a pro, I want to map Fixa categories to ledger accounts once and forget it.",
    "As a pro, I want to see sync errors and resolve them without leaving Fixa.",
  ],
};

const customersPro: CardData = {
  name: "Customers",
  icon: Users,
  surface: "Pro",
  description:
    "Customer records — contacts, history of requests/quotes/jobs/invoices, lifetime value.",
  statuses: ["Active", "Inactive", "VIP", "Archived"],
  userStories: [
    "As a pro, I want to see the full history of work I've done for a customer.",
    "As a pro, I want to filter customers by total spend or recency.",
    "As a pro, I want to merge two customer records that turn out to be the same person.",
  ],
};

const reportsPro: CardData = {
  name: "Reports",
  icon: BarChart3,
  surface: "Pro",
  description: "Revenue, profitability, top customers, time-to-paid analytics.",
  userStories: [
    "As a pro, I want a monthly view of revenue, profit margin, and outstanding invoices.",
    "As a pro, I want to identify my most profitable customer types or service categories.",
    "As a pro, I want to export reports to share with my accountant.",
  ],
};

const usersPro: CardData = {
  name: "Users",
  icon: UserCog,
  surface: "Pro",
  description: "Team members, roles, permissions.",
  statuses: ["Active", "Invited", "Disabled"],
  userStories: [
    "As an owner, I want to invite team members with specific roles (admin, dispatcher, technician).",
    "As an owner, I want to disable a user when they leave the company.",
    "As an owner, I want to see who did what (audit log) on sensitive actions.",
  ],
};

const findProClient: CardData = {
  name: "Find a pro",
  icon: Search,
  surface: "Client",
  description:
    "Searchable database of professionals — filter by trade, location, availability, rating.",
  userStories: [
    "As a client, I want to search for pros by trade and city so I can shortlist quickly.",
    "As a client, I want to see ratings and recent work before reaching out.",
    "As a client, I want to save pros I'm considering for later.",
  ],
};

const newRequestsClient: CardData = {
  name: "New request",
  icon: Plus,
  surface: "Client",
  description:
    "Submit a new request — to a specific pro or open to multiple pros.",
  userStories: [
    "As a client, I want to submit a request from my account without retyping contact info.",
    "As a client, I want to attach photos showing the problem.",
    "As a client, I want to send the same request to multiple pros to compare.",
  ],
};

const quotesClient: CardData = {
  name: "Quotes",
  icon: FileText,
  surface: "Client",
  description:
    "Quotes I've received — pending decisions, accepted, declined, expired.",
  statuses: ["Pending", "Accepted", "Declined", "Expired"],
  userStories: [
    "As a client, I want to compare quotes side-by-side from different pros.",
    "As a client, I want to accept, request changes, or decline a quote in one click.",
    "As a client, I want to keep declined quotes around for reference without polluting my active work.",
  ],
};

const projectsClient: CardData = {
  name: "Projects",
  icon: ClipboardList,
  surface: "Client",
  description:
    "Committed work — accepted quotes through to paid invoices. All documents (quote, contract, invoice) live inside the project.",
  statuses: ["Scheduled", "In progress", "Invoiced", "Paid", "Closed"],
  userStories: [
    "As a client, I want to see all active work on one page.",
    "As a client, I want to see when the pro is coming and any updates from them.",
    "As a client, I want to find the quote, contract, and invoice for a project without searching my email.",
    "As a client, I want to pay invoices without leaving the platform.",
  ],
};

const inboxClient: CardData = {
  name: "Inbox",
  icon: MessageSquare,
  surface: "Client",
  description: "Messages from pros and system notifications in one place.",
  statuses: ["Unread", "Read", "Archived"],
  userStories: [
    "As a client, I want all pro/system messages in one inbox so I don't miss updates.",
    "As a client, I want to reply to a pro without switching to email.",
    "As a client, I want unread counts so I know what needs attention.",
  ],
};

const servicePlansClient: CardData = {
  name: "Service plans",
  icon: Repeat,
  surface: "Client",
  description: "Recurring service contracts I'm subscribed to.",
  statuses: ["Active", "Paused", "Cancelled"],
  userStories: [
    "As a client, I want to see what's covered by my service plan and when the next visit is.",
    "As a client, I want to pause a plan without cancelling (e.g. moving house).",
    "As a client, I want to see what I've paid against the plan year-to-date.",
  ],
};

const profileClient: CardData = {
  name: "Profile",
  icon: User,
  surface: "Client",
  description: "Name, contact info, language preference.",
  userStories: [
    "As a client, I want to update my contact info once and have it apply everywhere.",
    "As a client, I want to choose the language Fixa talks to me in.",
  ],
};

const paymentMethodsClient: CardData = {
  name: "Payment methods",
  icon: CreditCard,
  surface: "Client",
  description: "Cards, bank accounts, autopay settings.",
  userStories: [
    "As a client, I want to save a payment method so I can pay invoices in one click.",
    "As a client, I want to enable autopay for service plans.",
    "As a client, I want to remove an old card without affecting active subscriptions.",
  ],
};

const notificationsClient: CardData = {
  name: "Notifications",
  icon: BellRing,
  surface: "Client",
  description: "Channel preferences — email, push, SMS — per event type.",
  userStories: [
    "As a client, I want to mute marketing emails but keep job updates.",
    "As a client, I want SMS reminders the day before a pro arrives.",
    "As a client, I want to turn off notifications during quiet hours.",
  ],
};

const channelsOnline: CardData = {
  name: "Channels",
  icon: Workflow,
  surface: "Online",
  description: "External integrations — Google Reserve, marketplace, ChatGPT.",
  userStories: [
    "As a pro, I want my Fixa profile to appear when someone searches for my service on Google.",
    "As a pro, I want bookings from external channels to land in my Requests automatically.",
  ],
};

/* --------------------------- Layout constants --------------------------- */

// 9 columns: 5 card columns + 4 arrow gap columns
//   col 1 = Leads (single column, stack of New request / Requests / Intakes / Website)
//   col 3 = Sales (Quotes / Service plans)
//   col 5 = Operations (Jobs / Schedule / Inbox)
//   col 7 = Financial (Invoices)
//   col 9 = Management (Customers / Reports / Users) — parallel, not in funnel
const gridTemplateWithArrows =
  "minmax(180px, 1fr) 16px minmax(180px, 1fr) 16px minmax(180px, 1fr) 16px minmax(180px, 1fr) 16px minmax(180px, 1fr)";

/* --------------------------- Page --------------------------- */

export default function BlueprintPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-16">
      <header className="flex flex-col gap-3 pb-16">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Fixa
        </p>
        <h1 className="font-display text-5xl font-medium tracking-tight sm:text-6xl">
          Blueprint
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Click any card for description, statuses, and user stories.
        </p>
      </header>

      <div className="-mx-6 overflow-x-auto px-6">
        <div className="flex min-w-[1000px] flex-col gap-2">
          <ProSection />
          <ClientSection />
          <OnlineSection />
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Sections --------------------------- */

function PhaseHeaders() {
  return (
    <div
      className="grid gap-x-2"
      style={{ gridTemplateColumns: gridTemplateWithArrows }}
    >
      <Eyebrow>Leads</Eyebrow>
      <div />
      <Eyebrow>Sales</Eyebrow>
      <div />
      <Eyebrow>Operations</Eyebrow>
      <div />
      <Eyebrow>Financial</Eyebrow>
      <div />
      <Eyebrow>Management</Eyebrow>
    </div>
  );
}

function ClientPhaseHeaders() {
  return (
    <div
      className="grid gap-x-2"
      style={{ gridTemplateColumns: gridTemplateWithArrows }}
    >
      <Eyebrow>Plan</Eyebrow>
      <div />
      <Eyebrow>Decide</Eyebrow>
      <div />
      <Eyebrow>Track</Eyebrow>
      <div />
      <div />
      <div />
      <Eyebrow>Account</Eyebrow>
    </div>
  );
}

function ProSection() {
  return (
    <section className="flex flex-col gap-3">
      <SurfaceDivider>Pro dashboard</SurfaceDivider>
      <PhaseHeaders />
      <div
        className="grid items-start gap-x-2"
        style={{ gridTemplateColumns: gridTemplateWithArrows }}
      >
        <ColumnStack
          cards={[newRequestPro, requestsPro, intakesPro, websitePro]}
        />
        <HorizontalArrow />
        <ColumnStack cards={[quotesPro, servicePlansPro]} />
        <HorizontalArrow />
        <ColumnStack cards={[jobsPro, schedule, inboxPro]} />
        <HorizontalArrow />
        <ColumnStack cards={[invoicesPro, accountingPro]} />
        <Empty />
        <ColumnStack cards={[customersPro, reportsPro, usersPro]} />
      </div>
    </section>
  );
}

function ClientSection() {
  return (
    <section className="flex flex-col gap-3">
      <SurfaceDivider>Client hub</SurfaceDivider>
      <ClientPhaseHeaders />
      <div
        className="grid items-start gap-x-2"
        style={{ gridTemplateColumns: gridTemplateWithArrows }}
      >
        <ColumnStack cards={[newRequestsClient, findProClient]} />
        <HorizontalArrow />
        <ColumnStack cards={[quotesClient, servicePlansClient]} />
        <HorizontalArrow />
        <ColumnStack cards={[projectsClient, inboxClient]} />
        <Empty />
        <Empty />
        <Empty />
        <ColumnStack
          cards={[profileClient, paymentMethodsClient, notificationsClient]}
        />
      </div>
    </section>
  );
}

function OnlineSection() {
  return (
    <section className="flex flex-col gap-3">
      <SurfaceDivider>Online</SurfaceDivider>
      <div
        className="grid items-start gap-x-2"
        style={{ gridTemplateColumns: gridTemplateWithArrows }}
      >
        <ColumnStack cards={[channelsOnline]} />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
        <Empty />
      </div>
    </section>
  );
}

/* --------------------------- Building blocks --------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function SurfaceDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pt-6">
      <span className="text-xs font-bold tracking-widest text-foreground uppercase">
        {children}
      </span>
      <div className="h-px bg-border" />
    </div>
  );
}

function Empty() {
  return <div aria-hidden />;
}

function ColumnStack({ cards }: { cards: CardData[] }) {
  return (
    <div className="flex flex-col gap-2">
      {cards.map((c) => (
        <CardItem key={c.name} card={c} />
      ))}
    </div>
  );
}

function HorizontalArrow() {
  // pt-3.5 (14px) so the arrow icon sits roughly at the first card's vertical
  // center (cards are ~44px tall with current padding).
  return (
    <div className="flex items-start justify-center pt-3.5">
      <ArrowRight
        aria-hidden
        className="size-4 text-muted-foreground"
        strokeWidth={1.5}
      />
    </div>
  );
}

function CardItem({ card }: { card: CardData }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-md border border-border bg-card px-3 py-3 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <card.icon
              className="size-4 shrink-0 text-foreground/70"
              strokeWidth={2}
            />
            <span className="truncate text-sm font-semibold">{card.name}</span>
          </button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-base">
            <card.icon className="size-5 text-foreground/70" strokeWidth={2} />
            <span>{card.name}</span>
            <SurfaceBadge surface={card.surface} />
          </DialogTitle>
          <DialogDescription className="pt-1">
            {card.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-2">
          {card.statuses && card.statuses.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Statuses
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {card.statuses.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {card.userStories && card.userStories.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                User stories
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-foreground/85">
                {card.userStories.map((story, i) => (
                  <li
                    key={i}
                    className="flex gap-2 leading-relaxed before:text-muted-foreground before:content-['—']"
                  >
                    <span>{story}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const surfaceStyles: Record<Surface, string> = {
  Pro: "border-blue-200 bg-blue-50 text-blue-700",
  Client: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Online: "border-slate-300 bg-slate-100 text-slate-600",
};

function SurfaceBadge({ surface }: { surface: Surface }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-wider whitespace-nowrap uppercase ${surfaceStyles[surface]}`}
    >
      {surface}
    </span>
  );
}
