export type WorkflowStage = {
  id: string;
  number?: number;
  title: string;
  summary: string;
  accentClass: string;
  version: "v1" | "v2" | "v3" | "later";
  inV1: boolean; // Behouden voor backwards compatibility
  entryPoints?: string[];
  flow: string[];
  dashboard?: {
    name: string;
    states: string[];
  };
  relatedViews?: { name: string; description: string }[];
  clientTouchpoints?: string[];
  supplierTouchpoints?: string[];
};

export const stages: WorkflowStage[] = [
  {
    id: "request",
    number: 1,
    title: "Request",
    summary:
      "Capture incoming work from three channels: online form, manual entry, or the Client Hub.",
    accentClass: "border-l-red-300",
    version: "v3",
    inV1: false,
    entryPoints: [
      "Online — homeowner fills out a form (e.g. via Google Maps or the professional's website).",
      "Manual — the professional creates the request themselves.",
      "Client Hub — an existing client creates a new request in their portal.",
    ],
    flow: [
      "Create request.",
      "Check whether the client already exists. If yes, attach the request to that client. If no, create a new client first.",
      "Request lands in the Requests overview, with a detail page per request.",
    ],
    dashboard: {
      name: "Requests overview",
      states: ["new", "completed", "overdue", "unscheduled", "archived"],
    },
    relatedViews: [
      {
        name: "Clients overview",
        description: "Dashboard of (1) new, (2) existing, (3) archived clients.",
      },
      {
        name: "Client details",
        description: "In-depth page with everything about a single client.",
      },
      {
        name: "Request details",
        description: "Detail page of a single request.",
      },
    ],
    clientTouchpoints: [
      "Existing client can create a new request directly in the Client Hub.",
    ],
  },
  {
    id: "intake",
    number: 2,
    title: "Intake",
    summary:
      "Decide whether the job needs on-location assessment and gather everything required to quote.",
    accentClass: "border-l-amber-300",
    version: "later",
    inV1: false,
    flow: [
      "Decision: does the request require an on-location assessment?",
      "If yes: schedule intake — propose a timeslot (visible in Client Hub) — client confirms — visit the client.",
      "After the visit, decide whether the work fits scope. If not, refuse the job.",
      "If no on-location assessment is needed: the professional uploads photos and text describing the job to the Client Hub.",
      "Loop: if the quote still needs information only the client can provide, ask via the Client Hub.",
    ],
    clientTouchpoints: [
      "Client confirms or declines the proposed intake timeslot.",
      "Client uploads photos or additional information when requested.",
    ],
  },
  {
    id: "quote",
    number: 3,
    title: "Quote",
    summary:
      "Compose the quote, optionally pull in supplier input, share it with the client, iterate until accepted.",
    accentClass: "border-l-orange-300",
    version: "v1",
    inV1: true,
    flow: [
      "Create new quote → quote details.",
      "Decision: does the quote need third-party (supplier) input? If yes, send a request via the Supplier Hub and wait for info to flow back.",
      "Quote is shared with the client — interactive in the Client Hub, with extra line items available as upsell.",
      "Decision: does the client request changes? If yes, loop back to quote details.",
      "Decision: does the client want to proceed? If no, cancel the job.",
      "Quote accepted (in Client Hub) → move to Job.",
    ],
    dashboard: {
      name: "Quotes overview",
      states: [
        "draft",
        "awaiting response",
        "changes requested",
        "ready to schedule",
        "converted",
        "declined",
        "archived",
      ],
    },
    clientTouchpoints: [
      "Client interacts with the quote in the Client Hub: (i) accept, (ii) decline, (iii) suggest changes. (v1)",
    ],
    supplierTouchpoints: [
      "Suppliers receive line-item requests by email and submit info through a Supplier Hub form. See the Supplier Hub section.",
    ],
  },
  {
    id: "job",
    number: 4,
    title: "Job",
    summary:
      "Convert an accepted quote into scheduled work, execute it, handle surprises.",
    accentClass: "border-l-blue-300",
    version: "v2",
    inV1: false,
    flow: [
      "Create job — the accepted quote is converted into a job.",
      "Job details: order any third-party material, align co-workers, find a timeslot.",
      "Share the timeslot with the client (visible in Client Hub).",
      "Decision: unforeseen events? If yes, loop back to align/reschedule.",
      "Complete job.",
    ],
    dashboard: {
      name: "Jobs overview",
      states: [
        "unscheduled",
        "action required",
        "invoice required",
        "late",
        "archived",
      ],
    },
    clientTouchpoints: [
      "Client accepts or declines the appointment for the job.",
    ],
  },
  {
    id: "invoice",
    number: 5,
    title: "Invoice",
    summary:
      "Bill for completed work — including fractional payments — and chase if unpaid.",
    accentClass: "border-l-violet-300",
    version: "v1",
    inV1: true,
    flow: [
      "Create invoice → invoice details (supports fractional payments).",
      "Invoice is shared with the client (visible in Client Hub).",
      "Decision: is the invoice paid? If yes, job completed. If no, remind the client and loop.",
    ],
    dashboard: {
      name: "Invoices overview",
      states: ["draft", "awaiting payment", "past due", "paid", "archived"],
    },
    clientTouchpoints: ["Client fulfills the invoice from the Client Hub."],
  },
];

export const hubs: WorkflowStage[] = [
  {
    id: "supplier-hub",
    title: "Supplier Hub",
    summary:
      "Cross-cutting flow for third-party suppliers who contribute line items or info to a quote.",
    accentClass: "border-l-slate-400",
    version: "later",
    inV1: false,
    flow: [
      "Supplier receives a request by email containing one or more line items.",
      "Supplier provides information through a URL leading to an online form.",
      "The submitted info flows back into the Quote stage.",
    ],
  },
  {
    id: "client-hub",
    title: "Client Hub",
    summary:
      "Client-facing portal that runs alongside every stage of the workflow.",
    accentClass: "border-l-emerald-400",
    version: "v1",
    inV1: true,
    flow: [
      "Surfaces requests, intakes, quotes, jobs, and invoices to the client at the right moment.",
      "Captures client actions (accept/decline appointments, accept/decline/change quotes, fulfill invoices) and feeds them back into the professional's workflow.",
    ],
    clientTouchpoints: [
      "Create a new request as an existing client.",
      "Upload photos or text to describe a job during intake.",
      "Accept or decline a proposed intake appointment.",
      "Accept, decline, or suggest changes on a quote. (v1)",
      "Accept or decline a proposed job appointment.",
      "Fulfill an invoice.",
    ],
  },
];

export const linearStageOrder = stages.map((s) => ({
  id: s.id,
  number: s.number!,
  title: s.title,
}));