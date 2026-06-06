# Dev log — 6 juni 2026 (deel 3)

## Settings pagina

### Architectuur
Server/client split voor cookie-veilige company ID ophaling:
- `src/app/dashboard/settings/page.tsx` — server component, haalt data op via service role client
- `src/app/dashboard/settings/client.tsx` — client component, ontvangt data als props

**Waarom service role in server component?**
De `active_company_id` cookie is `httpOnly` — onleesbaar via `document.cookie`. De server component leest de cookie via Next.js `cookies()` en gebruikt de service role client voor data queries (RLS bypass). De browser client in het client component doet alleen schrijf-operaties.

### Tabs
- Bedrijfsgegevens (volledig gebouwd)
- Producten & diensten (placeholder)
- Templates (offertenummering + offerte template placeholder)
- Billing (placeholder)

Tab routing via `?tab=` query parameter — deep-linkbaar vanuit onboarding stappen.

### Bedrijfsgegevens tab
- Logo upload naar `company-assets` bucket (public, 1MB max, JPG/PNG)
- Alle bedrijfsvelden: naam, adres, telefoon, email, KVK, BTW, IBAN
- Validatie op blur
- Sticky footer: Annuleren (secondary, altijd zichtbaar) + Wijzigingen opslaan (primary, disabled als niet dirty)

### Templates tab — offertenummering
- `last_parsed_quote_number` kolom toegevoegd aan `company_settings`
- Parsed offertenummer uit onboarding opgeslagen als referentie (niet als startnummer)
- `next_quote_number` start als `null` — pro stelt zelf in
- UX: referentietekst "Het offertenummer op de offerte die je deelde was: 2025010029" boven leeg input veld
- Na opslaan: toont "Volgend offertenummer: 2026-030" met potloodje

### Supabase
```sql
-- Nieuwe kolom
ALTER TABLE company_settings ADD COLUMN last_parsed_quote_number TEXT;

-- Storage bucket company-assets
-- Public, 1MB max, JPG/PNG only
-- Policies: authenticated upload + public read
```

---

## Onboarding stappen geüpdatet

Stap 3 en 4 vervangen door:
- **Logo uploaden** → `/dashboard/settings?tab=company` (voltooid als `logo_url` niet null)
- **Offertenummering instellen** → `/dashboard/settings?tab=templates` (voltooid als `next_quote_number` niet null)

Completion tracking in `layout.tsx` via service role queries op `companies.logo_url` en `company_settings.next_quote_number`.

---

## Parse route uitgebreid

`quoteNumber` toegevoegd als veld aan parse prompt en `ParsedQuoteData` type:
- Opgeslagen in sessionStorage als `onboarding_quoteNumber`
- Meegestuurd naar `/api/onboarding/save`
- Opgeslagen als `last_parsed_quote_number` in `company_settings`

---

## V1.1 product visie — AI foto interpretatie (gelogd)

Na foto upload → Claude Vision analyseert foto → title + beschrijving pre-filled per line item, afgestemd op vakgebied via skills-docs.

**Implicatie:** Als foto/video het beginpunt wordt, vervalt de noodzaak om een bestaande offerte te uploaden voor line items. Onboarding upload blijft relevant voor bedrijfsgegevens.

**Supplier flow (V2):** Pro filmt werk van onderaannemer → AI maakt line item → onderaannemer geeft prijs via Fixa supplier hub → pro neemt over met marge.

---

## Openstaand

- Stap 3 quote flow: preview + versturen (tokens resolven, foto's tonen, offertenummer toekennen)
- Dashboard: mockup data vervangen door echte Supabase queries
- Clients pagina (`/dashboard/customers`)
- Invoices list view
- Google Places Autocomplete adresveld
- Magic link werkt niet op mobile emulator — onderzoeken
- Onboarding mobile layout kapot (Nieks wijziging) — aan Niek melden
- Settings: logo upload testen op Fokker account
- Settings: onboarding tab links testen
