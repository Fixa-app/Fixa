"use client";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold">
          Onboarding complete!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your template is ready. Dashboard coming soon!
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            🎉 You've successfully set up your quote template with AI-powered parsing!
          </p>
        </div>
      </div>
    </div>
  );
}