"use client";

import { useState, type FormEvent, type ReactElement } from "react";
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

type Status = "idle" | "sending" | "sent" | "error";

export function AuthDialog({ children }: { children: ReactElement }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;

    setStatus("sending");
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        setEmail("");
        setStatus("idle");
        setErrorMessage("");
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-md">
        {status === "sent" ? (
          <div className="flex flex-col gap-4 pt-2">
            <DialogHeader>
              <DialogTitle>Bekijk je inbox</DialogTitle>
              <DialogDescription>
                We hebben een magic link gestuurd naar <strong>{email}</strong>.
                Klik op de link om in te loggen. Je kunt dit venster sluiten.
              </DialogDescription>
            </DialogHeader>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
            <DialogHeader>
              <DialogTitle>Verder naar Fixa</DialogTitle>
              <DialogDescription>
                Vul je e-mailadres in. We sturen je een magic link om in te
                loggen — of maken een account aan als je voor het eerst komt.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="auth-email">E-mailadres</Label>
              <Input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jij@voorbeeld.nl"
                disabled={status === "sending"}
              />
            </div>
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
            <Button type="submit" disabled={status === "sending" || !email}>
              {status === "sending" ? "Versturen..." : "Verstuur magic link"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
