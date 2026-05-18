import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Fixa
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Field-service management, reimagined.
          </h1>
          <p className="text-lg text-muted-foreground">
            We&apos;re still defining what to build. Start with the plan.
          </p>
        </div>
        <div className="flex gap-3">
          <Button render={<Link href="/plan" />}>Open the plan</Button>
        </div>
      </div>
    </main>
  );
}
