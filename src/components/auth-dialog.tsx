"use client";

import { useEffect, useState, type FormEvent, type ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const RESEND_SECONDS = 30;

type Step = "email" | "name" | "code";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthDialog({ children }: { children: ReactElement }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  // Resend countdown.
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  function reset() {
    setStep("email");
    setEmail("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setCode("");
    setIsNewUser(false);
    setLoading(false);
    setError("");
    setResendIn(0);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setTimeout(reset, 200);
  }

  function sendCode(createUser: boolean) {
    const supabase = createClient();
    return supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: createUser,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        ...(createUser
          ? {
              data: {
                first_name: firstName,
                last_name: lastName,
                phone,
                full_name: `${firstName} ${lastName}`.trim(),
              },
            }
          : {}),
      },
    });
  }

  // Step 1 — email. We try to sign in an existing user; if there's none,
  // Supabase errors and we route into account creation.
  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (signInError) {
      setIsNewUser(true);
      setStep("name");
    } else {
      setIsNewUser(false);
      setStep("code");
      setResendIn(RESEND_SECONDS);
    }
  }

  // Step 2 (new users) — collect details, create the account, send the code.
  async function handleNameSubmit(event: FormEvent) {
    event.preventDefault();
    if (!firstName || !lastName) return;
    setLoading(true);
    setError("");
    const { error: sendError } = await sendCode(true);
    setLoading(false);
    if (sendError) {
      setError(sendError.message);
      return;
    }
    setStep("code");
    setResendIn(RESEND_SECONDS);
  }

  // Step 3 — verify the code.
  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault();
    if (code.length < 6) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    if (verifyError) {
      setLoading(false);
      setError("Onjuiste of verlopen code. Probeer het opnieuw.");
      return;
    }
    window.location.assign("/dashboard");
  }

  async function handleResend() {
    if (resendIn > 0) return;
    setError("");
    setCode("");
    const { error: sendError } = await sendCode(isNewUser);
    if (sendError) {
      setError(sendError.message);
      return;
    }
    setResendIn(RESEND_SECONDS);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-md">
        {/* Step 1 — email */}
        {step === "email" && (
          <div className="flex flex-col gap-6">
            <DialogHeader className="gap-2">
              <DialogTitle className="font-display text-2xl">
                Welkom bij Fixa
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                Log in of maak een account aan. Geen wachtwoord nodig.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="auth-email" className="text-sm font-semibold">
                  E-mailadres
                </Label>
                <Input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jij@voorbeeld.nl"
                  disabled={loading}
                  className="h-12 rounded-xl border-foreground/15 bg-background text-base"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={loading || !email}
                className="h-12 rounded-xl text-base font-bold"
              >
                {loading ? "Bezig..." : "Doorgaan met e-mail"}
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-foreground/10" />
              <span className="text-xs font-bold tracking-widest text-foreground/50 uppercase">
                of
              </span>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <Button
              type="button"
              variant="outline"
              disabled
              className="h-12 w-full rounded-xl border-foreground/15 bg-background text-base font-bold text-foreground hover:bg-foreground/5"
            >
              <GoogleLogo />
              Doorgaan met Google
            </Button>

            <p className="text-center text-xs leading-relaxed text-foreground/60">
              Door door te gaan ga je akkoord met onze{" "}
              <a href="#" className="underline hover:text-foreground">
                voorwaarden
              </a>{" "}
              en{" "}
              <a href="#" className="underline hover:text-foreground">
                privacybeleid
              </a>
              .
            </p>
          </div>
        )}

        {/* Step 2 — create account (new users) */}
        {step === "name" && (
          <div className="flex flex-col gap-6">
            <DialogHeader className="gap-2">
              <DialogTitle className="font-display text-2xl">
                Maak je account aan
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                Vul je gegevens in om te beginnen. We sturen daarna een code naar{" "}
                <strong className="text-foreground">{email}</strong>.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="auth-first" className="text-sm font-semibold">
                    Voornaam
                  </Label>
                  <Input
                    id="auth-first"
                    required
                    autoFocus
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                    className="h-12 rounded-xl border-foreground/15 bg-background text-base"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Label htmlFor="auth-last" className="text-sm font-semibold">
                    Achternaam
                  </Label>
                  <Input
                    id="auth-last"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                    className="h-12 rounded-xl border-foreground/15 bg-background text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="auth-phone" className="text-sm font-semibold">
                  Telefoonnummer
                </Label>
                <Input
                  id="auth-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12345678"
                  disabled={loading}
                  className="h-12 rounded-xl border-foreground/15 bg-background text-base"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={loading || !firstName || !lastName}
                className="h-12 rounded-xl text-base font-bold"
              >
                {loading ? "Bezig..." : "Account aanmaken"}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="text-sm font-semibold text-foreground/60 hover:text-foreground"
            >
              ← Ander e-mailadres
            </button>
          </div>
        )}

        {/* Step 3 — verify code */}
        {step === "code" && (
          <div className="flex flex-col gap-6">
            <DialogHeader className="gap-2">
              <DialogTitle className="font-display text-2xl">
                Controleer je e-mail
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                We hebben een code gestuurd naar{" "}
                <strong className="text-foreground">{email}</strong>. Voer de
                code in, of gebruik de inlogknop in de e-mail.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="auth-code" className="text-sm font-semibold">
                  Verificatiecode
                </Label>
                <Input
                  id="auth-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  disabled={loading}
                  className="h-12 rounded-xl border-foreground/15 bg-background text-center text-xl font-bold tracking-[0.5em]"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={loading || code.length < 6}
                className="h-12 rounded-xl text-base font-bold"
              >
                {loading ? "Bezig..." : "Inloggen"}
              </Button>
            </form>

            <div className="text-center text-sm text-foreground/60">
              {resendIn > 0 ? (
                <span>Geen code ontvangen? Opnieuw versturen in {resendIn}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-foreground hover:underline"
                >
                  Opnieuw versturen
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setError("");
              }}
              className="text-sm font-semibold text-foreground/60 hover:text-foreground"
            >
              ← Ander e-mailadres
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
