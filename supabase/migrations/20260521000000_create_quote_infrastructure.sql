-- ============================================================================
-- Fixa v1 Database Schema: Multi-tenant Quote Management
-- ============================================================================
-- This migration creates the foundational infrastructure for the quote flow:
-- Companies → Clients → Quotes → Line Items → Activity → Photos
--
-- Design principles:
-- 1. Multi-tenant: All data scoped to companies
-- 2. Extensible: Role enum and FKs ready for v2 (jobs, invoices)
-- 3. Secure: RLS policies enforce company isolation
-- 4. Performant: Indexes on common query patterns
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Company role enum (extensible for future roles like 'accountant', 'dispatcher')
CREATE TYPE company_role AS ENUM ('owner', 'admin', 'member');

-- Quote status enum (matches workflow states)
CREATE TYPE quote_status AS ENUM (
  'draft',
  'ready_to_send',
  'awaiting_response',
  'changes_requested',
  'approved',
  'declined',
  'archived'
);

-- Line item type enum
CREATE TYPE line_item_type AS ENUM ('labor', 'material', 'other');

-- Quote activity type enum
CREATE TYPE quote_activity_type AS ENUM (
  'created',
  'updated',
  'sent',
  'viewed',
  'approved',
  'declined',
  'changes_requested',
  'archived'
);

-- ============================================================================
-- COMPANIES
-- ============================================================================

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  email text,
  vat_number text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX companies_created_at_idx ON public.companies(created_at DESC);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- COMPANY MEMBERS (many-to-many: users ↔ companies)
-- ============================================================================

CREATE TABLE public.company_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role company_role NOT NULL DEFAULT 'member',
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_at timestamptz NOT NULL DEFAULT now(),
  joined_at timestamptz,
  
  -- Prevent duplicate memberships
  UNIQUE(company_id, user_id)
);

CREATE INDEX company_members_company_id_idx ON public.company_members(company_id);
CREATE INDEX company_members_user_id_idx ON public.company_members(user_id);

-- ============================================================================
-- CLIENTS (company-scoped)
-- ============================================================================

CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  gps_lat decimal(10, 8),
  gps_lng decimal(11, 8),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX clients_company_id_idx ON public.clients(company_id);
CREATE INDEX clients_name_idx ON public.clients(company_id, name);
CREATE INDEX clients_created_at_idx ON public.clients(company_id, created_at DESC);

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- QUOTES (company-scoped)
-- ============================================================================

CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  created_by_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  
  status quote_status NOT NULL DEFAULT 'draft',
  
  intro_text text,
  disclaimer text,
  
  -- Calculated fields (denormalized for performance)
  subtotal decimal(10, 2),
  tax_amount decimal(10, 2),
  total_amount decimal(10, 2),
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  approved_at timestamptz,
  
  -- Future v2 fields (nullable, ready for jobs migration)
  converted_to_job_id uuid, -- Will become FK to jobs table in v2
  
  CONSTRAINT positive_amounts CHECK (
    (subtotal IS NULL OR subtotal >= 0) AND
    (tax_amount IS NULL OR tax_amount >= 0) AND
    (total_amount IS NULL OR total_amount >= 0)
  )
);

CREATE INDEX quotes_company_id_idx ON public.quotes(company_id);
CREATE INDEX quotes_client_id_idx ON public.quotes(client_id);
CREATE INDEX quotes_status_idx ON public.quotes(company_id, status);
CREATE INDEX quotes_created_at_idx ON public.quotes(company_id, created_at DESC);
CREATE INDEX quotes_created_by_idx ON public.quotes(created_by_user_id);

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- LINE ITEMS (quote-scoped)
-- ============================================================================

CREATE TABLE public.line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  
  description text NOT NULL,
  quantity decimal(10, 2) NOT NULL DEFAULT 1,
  rate decimal(10, 2) NOT NULL,
  tax_percentage integer NOT NULL DEFAULT 21, -- Dutch VAT: 21%, 9%, or 0%
  item_type line_item_type NOT NULL DEFAULT 'labor',
  
  -- Display order
  sort_order integer NOT NULL DEFAULT 0,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_rate CHECK (rate >= 0),
  CONSTRAINT valid_tax CHECK (tax_percentage IN (0, 9, 21))
);

CREATE INDEX line_items_quote_id_idx ON public.line_items(quote_id);
CREATE INDEX line_items_sort_order_idx ON public.line_items(quote_id, sort_order);

-- ============================================================================
-- QUOTE ACTIVITY LOG (audit trail)
-- ============================================================================

CREATE TABLE public.quote_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  activity_type quote_activity_type NOT NULL,
  note text,
  
  -- Metadata (e.g., IP address, email sent to, etc.)
  metadata jsonb,
  
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX quote_activity_quote_id_idx ON public.quote_activity(quote_id, created_at DESC);
CREATE INDEX quote_activity_type_idx ON public.quote_activity(quote_id, activity_type);

-- ============================================================================
-- QUOTE PHOTOS (stored in Supabase Storage)
-- ============================================================================

CREATE TABLE public.quote_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  
  -- Storage path in Supabase Storage bucket
  storage_path text NOT NULL,
  
  -- Display order
  sort_order integer NOT NULL DEFAULT 0,
  
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX quote_photos_quote_id_idx ON public.quote_photos(quote_id, sort_order);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if user is member of a company
CREATE OR REPLACE FUNCTION public.is_company_member(
  p_company_id uuid,
  p_user_id uuid
)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_members
    WHERE company_id = p_company_id
    AND user_id = p_user_id
  );
$$;

-- Check if user is owner or admin of a company
CREATE OR REPLACE FUNCTION public.is_company_admin(
  p_company_id uuid,
  p_user_id uuid
)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_members
    WHERE company_id = p_company_id
    AND user_id = p_user_id
    AND role IN ('owner', 'admin')
  );
$$;

-- Get user's companies (for UI company switcher)
CREATE OR REPLACE FUNCTION public.get_user_companies(p_user_id uuid)
RETURNS TABLE (
  company_id uuid,
  company_name text,
  user_role company_role,
  joined_at timestamptz
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
STABLE
AS $$
  SELECT 
    c.id AS company_id,
    c.name AS company_name,
    cm.role AS user_role,
    cm.joined_at
  FROM public.companies c
  INNER JOIN public.company_members cm ON c.id = cm.company_id
  WHERE cm.user_id = p_user_id
  ORDER BY cm.joined_at ASC;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_photos ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- COMPANIES
-- ----------------------------------------------------------------------------

-- Users can read companies they're members of
CREATE POLICY "Users can read their companies"
  ON public.companies FOR SELECT
  TO authenticated
  USING (
    public.is_company_member(id, auth.uid())
  );

-- Only owners can update companies
CREATE POLICY "Owners can update companies"
  ON public.companies FOR UPDATE
  TO authenticated
  USING (
    public.is_company_admin(id, auth.uid())
  )
  WITH CHECK (
    public.is_company_admin(id, auth.uid())
  );

-- Any authenticated user can create a company (onboarding)
CREATE POLICY "Users can create companies"
  ON public.companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only owners can delete companies
CREATE POLICY "Owners can delete companies"
  ON public.companies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.company_members
      WHERE company_id = companies.id
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- ----------------------------------------------------------------------------
-- COMPANY MEMBERS
-- ----------------------------------------------------------------------------

-- Users can read members of their companies
CREATE POLICY "Users can read company members"
  ON public.company_members FOR SELECT
  TO authenticated
  USING (
    public.is_company_member(company_id, auth.uid())
  );

-- Owners/admins can invite new members
CREATE POLICY "Admins can invite members"
  ON public.company_members FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_company_admin(company_id, auth.uid())
  );

-- Owners/admins can update memberships
CREATE POLICY "Admins can update members"
  ON public.company_members FOR UPDATE
  TO authenticated
  USING (
    public.is_company_admin(company_id, auth.uid())
  )
  WITH CHECK (
    public.is_company_admin(company_id, auth.uid())
  );

-- Owners/admins can remove members (except themselves)
CREATE POLICY "Admins can remove members"
  ON public.company_members FOR DELETE
  TO authenticated
  USING (
    public.is_company_admin(company_id, auth.uid())
    AND user_id != auth.uid() -- Can't remove yourself
  );

-- ----------------------------------------------------------------------------
-- CLIENTS
-- ----------------------------------------------------------------------------

-- Members can read clients in their companies
CREATE POLICY "Members can read clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (
    public.is_company_member(company_id, auth.uid())
  );

-- Members can create clients
CREATE POLICY "Members can create clients"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_company_member(company_id, auth.uid())
  );

-- Members can update clients
CREATE POLICY "Members can update clients"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (
    public.is_company_member(company_id, auth.uid())
  )
  WITH CHECK (
    public.is_company_member(company_id, auth.uid())
  );

-- Only admins can delete clients
CREATE POLICY "Admins can delete clients"
  ON public.clients FOR DELETE
  TO authenticated
  USING (
    public.is_company_admin(company_id, auth.uid())
  );

-- ----------------------------------------------------------------------------
-- QUOTES
-- ----------------------------------------------------------------------------

-- Members can read quotes in their companies
CREATE POLICY "Members can read quotes"
  ON public.quotes FOR SELECT
  TO authenticated
  USING (
    public.is_company_member(company_id, auth.uid())
  );

-- Members can create quotes
CREATE POLICY "Members can create quotes"
  ON public.quotes FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_company_member(company_id, auth.uid())
  );

-- Members can update quotes
CREATE POLICY "Members can update quotes"
  ON public.quotes FOR UPDATE
  TO authenticated
  USING (
    public.is_company_member(company_id, auth.uid())
  )
  WITH CHECK (
    public.is_company_member(company_id, auth.uid())
  );

-- Members can delete quotes
CREATE POLICY "Members can delete quotes"
  ON public.quotes FOR DELETE
  TO authenticated
  USING (
    public.is_company_member(company_id, auth.uid())
  );

-- ----------------------------------------------------------------------------
-- LINE ITEMS (inherit from quotes)
-- ----------------------------------------------------------------------------

-- Members can read line items for quotes in their companies
CREATE POLICY "Members can read line items"
  ON public.line_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = line_items.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  );

-- Members can create line items
CREATE POLICY "Members can create line items"
  ON public.line_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = line_items.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  );

-- Members can update line items
CREATE POLICY "Members can update line items"
  ON public.line_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = line_items.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = line_items.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  );

-- Members can delete line items
CREATE POLICY "Members can delete line items"
  ON public.line_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = line_items.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- QUOTE ACTIVITY (inherit from quotes)
-- ----------------------------------------------------------------------------

-- Members can read activity for quotes in their companies
CREATE POLICY "Members can read quote activity"
  ON public.quote_activity FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = quote_activity.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  );

-- Members can create activity entries
CREATE POLICY "Members can create quote activity"
  ON public.quote_activity FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = quote_activity.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- QUOTE PHOTOS (inherit from quotes)
-- ----------------------------------------------------------------------------

-- Members can read photos for quotes in their companies
CREATE POLICY "Members can read quote photos"
  ON public.quote_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = quote_photos.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  );

-- Members can create photos
CREATE POLICY "Members can create quote photos"
  ON public.quote_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = quote_photos.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  );

-- Members can delete photos
CREATE POLICY "Members can delete quote photos"
  ON public.quote_photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = quote_photos.quote_id
      AND public.is_company_member(quotes.company_id, auth.uid())
    )
  );

-- ============================================================================
-- STORAGE BUCKET SETUP (for quote photos)
-- ============================================================================

-- Create storage bucket for quote photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-photos', 'quote-photos', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for storage bucket: members can upload/view photos for their company's quotes
CREATE POLICY "Members can upload quote photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'quote-photos'
    AND EXISTS (
      SELECT 1 FROM public.quote_photos qp
      INNER JOIN public.quotes q ON qp.quote_id = q.id
      WHERE qp.storage_path = name
      AND public.is_company_member(q.company_id, auth.uid())
    )
  );

CREATE POLICY "Members can view quote photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'quote-photos'
    AND EXISTS (
      SELECT 1 FROM public.quote_photos qp
      INNER JOIN public.quotes q ON qp.quote_id = q.id
      WHERE qp.storage_path = name
      AND public.is_company_member(q.company_id, auth.uid())
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.companies IS 'Company workspaces - each company is an isolated tenant';
COMMENT ON TABLE public.company_members IS 'Many-to-many relationship between users and companies with role-based access';
COMMENT ON TABLE public.clients IS 'Clients per company - isolated by company_id';
COMMENT ON TABLE public.quotes IS 'Quotes per company - core v1 feature';
COMMENT ON TABLE public.line_items IS 'Line items (labor/materials) for quotes';
COMMENT ON TABLE public.quote_activity IS 'Audit log of all quote interactions';
COMMENT ON TABLE public.quote_photos IS 'Photos attached to quotes (stored in Supabase Storage)';

COMMENT ON COLUMN public.quotes.converted_to_job_id IS 'Reserved for v2: FK to jobs table when quote is accepted';
COMMENT ON COLUMN public.line_items.tax_percentage IS 'Dutch VAT rates: 21% (standard), 9% (reduced), 0% (exempt)';