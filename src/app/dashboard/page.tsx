"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification only if onboarding just completed
    const justOnboarded = sessionStorage.getItem('just_onboarded');
    if (justOnboarded) {
      setShowNotification(true);
      sessionStorage.removeItem('just_onboarded');
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between p-6">
        <button
          aria-label="Menu"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <svg
            className="h-5 w-5 text-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          aria-label="User profile"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <svg
            className="h-5 w-5 text-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 space-y-6 px-6 pb-12">
        {/* Page title */}
        <h1 className="font-display text-4xl font-bold">Overview</h1>

        {/* Onboarding notification */}
        {showNotification && (
          <button
            role="alert"
            aria-label="Success: your quote template is good to go"
            onClick={() => {
  setShowNotification(false);
  router.push('/settings/template');
}}
            className="flex w-full items-center gap-3 rounded-2xl bg-foreground px-5 py-4 text-left text-background transition-opacity animate-in fade-in duration-500 hover:opacity-90"
          >
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-background/20">
              <svg
                className="h-4 w-4 text-background"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="flex-1 text-sm font-medium">
              You're all set. Your quote template is good to go
            </span>
            <svg
              className="h-4 w-4 flex-shrink-0 text-background/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Quotes section */}
        <div className="rounded-2xl bg-muted/50 p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Quotes</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You haven't sent any quotes yet
              </p>
            </div>
            <button
              aria-label="Create quote"
              onClick={() => router.push('/quotes/new')}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Invoices section */}
        <div className="rounded-2xl bg-muted/50 p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Invoices</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                No invoices yet. Send one after your first job
              </p>
            </div>
            <button
              aria-label="Create invoice"
              onClick={() => router.push('/invoices/new')}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}