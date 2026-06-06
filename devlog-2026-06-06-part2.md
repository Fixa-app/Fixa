# Dev log — 6 juni 2026 (deel 2)

## Stap 2 new quote flow — foto upload

### Gebouwd
- `src/app/api/quotes/[id]/photos/route.ts` — GET (ophalen + signed URLs), POST (opslaan referentie), DELETE (verwijderen uit Storage + DB)
- `src/app/dashboard/quotes/new/[id]/items/page.tsx` — foto upload per line item

### DB wijzigingen
```sql
-- line_item_id toegevoegd aan quote_photos
ALTER TABLE quote_photos 
ADD COLUMN line_item_id UUID REFERENCES line_items(id) ON DELETE CASCADE;

-- Grants
GRANT ALL ON quote_photos TO service_role;
GRANT ALL ON quote_photos TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
```

### Storage
- Bucket: `quote-photos` (bestond al)
- Upload policy vereenvoudigd: `(bucket_id = 'quote-photos') AND (auth.uid() IS NOT NULL)`
- Upload via browser client direct naar Supabase Storage (geen server hop voor binaire bestanden)

### UX beslissingen
- 3 vaste slots per line item — communiceert max visueel zonder tekst
- Native iOS file picker (`<input type="file" accept="image/*" multiple>`) — geeft automatisch "Maak foto / Kies uit bibliotheek" sheet
- Multi-select: pro kan meerdere foto's tegelijk selecteren, max 3 per item
- Melding "Maximum 3 foto's per post bereikt" blijft zichtbaar zolang alle slots gevuld zijn
- Trash icon consistent met delete icon van line items
- Hover state delete knop: subtiele rode tint (`hover:bg-red-50`)

### Overige stap 2 fixes
- Label "Taakomschrijving" → "Klusnaam" met betere placeholder: "Bijv. Badkamer renovatie Jansen, Dak reparatie nr. 12"
- Meer ruimte tussen label en input veld

---

## V1.1 product visie — AI foto interpretatie

### Concept
Na foto upload stuurt de app de foto naar Claude Vision. Claude genereert automatisch een pre-filled beschrijving per line item, afgestemd op het vakgebied van de pro.

**Flow:**
1. Pro maakt foto van het werk (of uploadt uit bibliotheek)
2. Claude Vision analyseert foto met vakgebied-specifieke context
3. Title + beschrijving worden automatisch ingevuld in het line item
4. Pro controleert, past aan indien nodig, vult prijs en aantal in

### Skills-docs per vakgebied
Per vakgebied (schilder, hovenier, loodgieter, tegelzetter, etc.) wordt een kort document gemaakt met:
- Vakjargon
- Typische werkzaamheden
- Juiste toon voor offertes

Dit wordt meegestuurd als context aan Claude, zodat beschrijvingen kloppen met hoe een schilder praat versus een hovenier.

### Implicaties voor de quote flow
Als foto/video het beginpunt wordt, vervalt de noodzaak om een bestaande offerte te uploaden voor de line items. De onboarding upload blijft relevant voor bedrijfsgegevens en `company_settings`, maar line items in de quote flow komen dan van de camera.

**Nieuwe flow:**
1. Pro maakt foto van het werk → AI genereert title + beschrijving
2. Pro vult prijs en hoeveelheid in
3. Geen handmatig typen meer nodig

### Technische haalbaarheid
De bouwblokken zijn er al:
- Foto upload → Supabase Storage ✅
- Claude Vision API → al in gebruik voor onboarding ✅
- Beschrijvingsveld per line item ✅
- Industry category per bedrijf (geparsed in onboarding) ✅

Geschatte bouwtijd: 1 dag voor de koppeling tussen foto upload en Claude Vision call.

### Verbinding met supplier flow (V2)
Pro filmt het werk van de onderaannemer → AI maakt het line item aan → pro koppelt de onderaannemer eraan → onderaannemer geeft prijs via Fixa supplier hub.

---

## Openstaand

- Stap 3: preview + versturen (tokens resolven, foto's tonen)
- Dashboard: mockup data vervangen door echte Supabase queries
- Clients pagina (`/dashboard/customers`)
- Invoices list view
- Google Places Autocomplete voor adresveld
- Magic link werkt niet op mobile emulator — onderzoeken
- Onboarding mobile layout kapot (Nieks wijziging) — aan Niek melden
