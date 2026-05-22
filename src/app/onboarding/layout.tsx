export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header with logo */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-xl font-semibold text-foreground">
            Fixa
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}