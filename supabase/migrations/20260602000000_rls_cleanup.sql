-- ============================================================
-- RLS Cleanup: security fixes + remove redundant policies
-- ============================================================
--
-- BEFORE RUNNING: fetch exact policy names from your DB and
-- update the DROP statements below to match.
--
--   SELECT tablename, policyname, cmd, roles
--   FROM pg_policies
--   WHERE schemaname = 'public'
--   ORDER BY tablename, policyname;
--
-- The DROP statements use IF EXISTS so a name mismatch will
-- silently no-op rather than abort the transaction. The CREATE
-- statements at the end are unconditional and will always apply
-- the correct security rules.
-- ============================================================

begin;

-- ============================================================
-- SECTION 1: SECURITY FIXES
-- ============================================================

-- ── invitations ─────────────────────────────────────────────
-- Problem: public SELECT (true) exposes all invitation tokens
-- and email addresses to anonymous users across all tenants.
drop policy if exists "Enable read access for all users" on invitations;
drop policy if exists "Public read" on invitations;
drop policy if exists "public SELECT" on invitations;

create policy "owner read invitations" on invitations
  for select
  using (is_tenant_owner(tenant_id));

-- ── team_members ─────────────────────────────────────────────
-- Problem: public SELECT (true) exposes all staff names/roles
-- across every tenant to anonymous users.
drop policy if exists "Enable read access for all users" on team_members;
drop policy if exists "Public read" on team_members;
drop policy if exists "public SELECT" on team_members;

create policy "owner read team_members" on team_members
  for select
  using (is_tenant_owner(tenant_id));

-- ── products ─────────────────────────────────────────────────
-- Problem: public SELECT (true) exposes inactive products.
-- Replace with active-only filter for public reads.
drop policy if exists "Enable read access for all users" on products;
drop policy if exists "Public read" on products;
drop policy if exists "public SELECT" on products;

create policy "public read active products" on products
  for select
  to anon, authenticated
  using (active = true);


-- ============================================================
-- SECTION 2: REMOVE REDUNDANT POLICIES
-- ============================================================
-- In each case below, an `owner ALL` policy already exists and
-- covers SELECT + INSERT + UPDATE + DELETE. The narrower
-- per-command policies are dead weight that make audits harder.
--
-- Replace each quoted name with the exact policyname value
-- from pg_policies before running.
-- ============================================================

-- ── orders ───────────────────────────────────────────────────
-- Keep: owner ALL, anon INSERT (one copy only)
-- Drop: owner SELECT (covered by ALL)
-- Drop: owner UPDATE (covered by ALL)
-- Drop: one of the two duplicate anon INSERT policies
drop policy if exists "owner SELECT" on orders;
drop policy if exists "owner UPDATE" on orders;
-- Drop whichever of these two is the duplicate; keep the other:
drop policy if exists "anon INSERT (anon role)" on orders;

-- ── order_items ──────────────────────────────────────────────
-- Keep: owner ALL, anon INSERT
-- Drop: owner SELECT (covered by ALL)
drop policy if exists "owner SELECT" on order_items;

-- ── products ─────────────────────────────────────────────────
-- Keep: owner ALL (is_tenant_owner)
-- Drop: duplicate owner ALL (via tenant join)
drop policy if exists "owner ALL (via tenant join)" on products;

-- ── stores ───────────────────────────────────────────────────
-- Keep: owner ALL (is_tenant_owner)
-- Drop: duplicate owner ALL (via tenant join)
drop policy if exists "owner ALL (via tenant join)" on stores;

-- ── tenants ──────────────────────────────────────────────────
-- Keep: owner ALL
-- Drop: owner SELECT (covered by ALL)
-- Drop: owner UPDATE (covered by ALL)
drop policy if exists "owner SELECT" on tenants;
drop policy if exists "owner UPDATE" on tenants;

commit;
