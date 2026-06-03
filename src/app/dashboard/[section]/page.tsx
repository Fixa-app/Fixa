import { labelForSlug } from "../nav";

export default async function DashboardSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const label = labelForSlug(section);

  return (
    <div className="space-y-2 px-6 py-8 md:px-10">
      <h1 className="font-display text-3xl font-bold">{label}</h1>
      <p className="text-muted-foreground">Binnenkort beschikbaar.</p>
    </div>
  );
}
