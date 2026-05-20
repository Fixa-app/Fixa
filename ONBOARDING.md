# Fixa onboarding

Welcome. This is everything you need to get from "I got the invite" to "I'm pushing code."

## 1. Accept invites

- **GitHub** (`Fixa-app` org): <https://github.com/orgs/Fixa-app/invitation> — accept, you'll get push access to `Fixa-app/Fixa`.
- **Supabase** (`Fixa` org): check your email for the invite from Supabase, accept it, you'll get full dashboard access.
- **Vercel:** no invite. We're on the Hobby plan, which doesn't allow team members. Niek owns the Vercel side; deploys happen automatically when you push to `main`, so you don't usually need direct access. If you need to see logs or env vars, ask Niek.

## 2. Install the tools you need

Already have most of these? Skip ahead.

```bash
# Node (v20+)
# Most macs already have this. Check with `node --version`.
# If not: https://nodejs.org/ or `brew install node`

# pnpm (our package manager)
brew install pnpm
```

## 3. Clone and run

```bash
git clone https://github.com/Fixa-app/Fixa.git
cd Fixa
pnpm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://yruvaccvrxzotaalnvrq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rreDfqX2CXcl_PLSh6laZQ_DUubZXH2
```

These two values aren't secret (the `NEXT_PUBLIC_` prefix means they ship to the browser anyway), so it's fine that they're written down here.

Run the dev server:

```bash
pnpm dev
```

Visit <http://localhost:3000>. Edit any file — changes hot-reload.

## 4. Set your commit identity for this repo

So your commits show up under your name, not whatever your global git config has:

```bash
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

While you're there, set rebase as the default for `git pull` in this repo (see "How we work" below for why):

```bash
git config pull.rebase true
```

## 5. Try the deployed app

Production: see your Vercel dashboard (or ask Niek for the current alias).

Click any "Sign in" or "Start free trial" button, enter your email, click the magic link in your inbox. You'll be logged in. That's the auth flow.

The internal planning workspace lives at `/plan` — link is also in the top nav.

---

# How we work

## The TL;DR

- We push directly to `main`. No branches, no PRs.
- Always `git pull --rebase` before push.
- Always run `pnpm build` before push.
- Talk to each other before starting on anything bigger than ~30 minutes of work.

## Why no branches or PRs?

Pre-product, two trusted devs. Branches and PRs add friction that doesn't pay back until we have customers or want preview deploys for specific changes. We can opt into branch + PR for a specific change anytime it helps (e.g. risky UI you want to test on a Vercel preview URL before promoting to prod). Most of the time, just ship.

## Daily flow

```bash
# Start of day
git pull --rebase           # pull teammate's changes

# As you work, commit often
git add -p                  # stage piece-by-piece (or `git add .` if obvious)
git commit -m "Add intake form validation"

# Before pushing
pnpm build                  # type-check + compile, ~30s. Catches type errors and bad syntax.
git pull --rebase           # one more sync in case teammate pushed during the build
git push                    # ships to Vercel prod automatically
```

## When things go wrong

- **Your push is rejected** ("non-fast-forward") — teammate pushed first. Run `git pull --rebase` then `git push` again.
- **Rebase has a conflict** — fix the conflicted file in your editor, then `git add <file>` and `git rebase --continue`. (If you panic: `git rebase --abort` returns you to where you started.)
- **You broke main / Vercel deploy failed** — push a fix immediately, or `git revert <bad-commit-sha> && git push` to undo the bad commit. Don't leave main broken — the other person can't deploy their own work until it's fixed.

## What's where in the codebase

| Path | What lives there |
|---|---|
| [src/app/](src/app/) | Next.js App Router pages and route handlers |
| [src/app/auth/callback/](src/app/auth/callback/) | Magic-link callback that exchanges the code for a session |
| [src/components/](src/components/) | Hand-written React components (header, auth dialog) |
| [src/components/ui/](src/components/ui/) | shadcn/ui primitives. Regenerate via shadcn CLI, don't hand-edit |
| [src/lib/supabase/](src/lib/supabase/) | Supabase client helpers (browser + server, both PKCE) |
| [src/data/](src/data/) | Typed content data (e.g. the workflow definition) |
| [.env.local](.env.local) | Your local env vars. Gitignored. |
| [.env.example](.env.example) | What env vars you need. Committed. |

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind v4** + **shadcn/ui** (base-nova style, neutral palette)
- **Supabase** for auth + Postgres
- **Vercel** for deploys
- **pnpm** for packages

## Communication

- Mention what you're working on before you start anything bigger than a quick fix — two people editing the same file is the main source of rebase conflicts.
- Ask when in doubt. 30 seconds asking beats an hour untangling.

## When to revisit this workflow

We'll switch to a feature-branch + PR flow when any of these happens:
- We have real users (broken main = customer incident).
- Broken-main incidents start blocking work repeatedly.
- One of us wants a sanity check before merging on a recurring basis.

Until then: ship.
