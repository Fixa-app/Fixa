import Link from "next/link";
import Image from "next/image";

const footerColumns: {
  title: string;
  links: { name: string; href: string }[];
}[] = [
  {
    title: "Bedrijfstypen",
    links: [
      { name: "Loodgieters", href: "#" },
      { name: "Elektriciens", href: "#" },
      { name: "CV & klimaat", href: "#" },
      { name: "Hoveniers", href: "#" },
      { name: "Schoonmaak", href: "#" },
      { name: "Klusbedrijf", href: "#" },
      { name: "Schilders", href: "#" },
      { name: "Dakdekkers", href: "#" },
    ],
  },
  {
    title: "Features",
    links: [
      { name: "Online aanvragen", href: "#" },
      { name: "Offertes", href: "/products/offertes" },
      { name: "Planning", href: "#" },
      { name: "Schedule", href: "#" },
      { name: "Betalingen", href: "#" },
      { name: "Rapporten", href: "#" },
      { name: "Fixa Assist AI", href: "#" },
    ],
  },
  {
    title: "Bedrijf",
    links: [
      { name: "Over", href: "#" },
      { name: "Prijzen", href: "/pricing" },
      { name: "Blog", href: "#" },
      { name: "Carrières", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="px-4 pb-4">
      <div className="relative mx-auto w-full max-w-[1920px] overflow-hidden rounded-3xl bg-secondary text-white">
        <div className="relative mx-auto flex w-full max-w-[1536px] flex-col gap-10 px-5 py-10 md:py-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" aria-label="Fixa" className="inline-flex">
                <Image
                  src="/fixa-logo.svg"
                  alt="Fixa"
                  width={80}
                  height={80}
                  className="h-18 w-auto invert"
                />
              </Link>
            </div>
            {footerColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h3 className="text-base font-bold text-white/50">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-base font-bold text-white transition-colors hover:text-white/80"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} Fixa B.V.</span>
            <button type="button" className="transition-colors hover:text-white">
              Cookie-instellingen
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
