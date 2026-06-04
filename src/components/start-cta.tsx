import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";

export function StartCta() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center md:gap-12 lg:px-5">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            Start vandaag met Fixa.
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-foreground/70">
            Upload je bestaande factuur en verstuur binnen enkele minuten je
            eerste via Fixa. Gratis zolang je maandomzet onder €5k blijft.
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
          <Button
            className="h-12 rounded-xl bg-black px-6 text-base font-bold text-white hover:bg-black/80"
            nativeButton={false}
            render={<a href="#contact" />}
          >
            Boek een demo
          </Button>
          <AuthDialog>
            <Button className="h-12 rounded-xl px-6 text-base font-bold">
              Aan de slag
            </Button>
          </AuthDialog>
        </div>
      </div>
    </section>
  );
}
