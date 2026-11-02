-- SINEA 004: canais escola-família, comunicados e agenda; sem GRANTS.
-- Somente demonstração e estrutura. Dados pessoais reais continuam bloqueados.
BEGIN;
CREATE TABLE IF NOT EXISTS sinea.guardianships (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 guardian_subject text NOT NULL,
 verification_kind text NOT NULL,
 verified_by_subject text,
 verified_at timestamptz,
 status text NOT NULL DEFAULT 'pending'
  CHECK(status IN ('pending','verified','suspended','revoked')),
 valid_from timestamptz NOT NULL DEFAULT now(),
 valid_to timestamptz,
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS guardianships_active_idx ON sinea.guardianships(tenant_id,guardian_subject)
 WHERE status='verified';
CREATE TABLE IF NOT EXISTS sinea.school_channels (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 school_id uuid NOT NULL,
 channel_kind text NOT NULL
  CHECK(channel_kind IN ('pedagogical','aee','administrative')),
 state text NOT NULL DEFAULT 'active' CHECK(state IN ('active','closed')),
 name text NOT NULL,
 response_policy text,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,school_id) REFERENCES sinea.schools(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.school_messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 channel_id uuid NOT NULL,
 student_id uuid,
 sender_subject text NOT NULL,
 recipient_subject text NOT NULL,
 body_object_key text NOT NULL,
 sent_at timestamptz NOT NULL DEFAULT now(),
 state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','delivered','read','withdrawn')),
 client_mutation_id uuid NOT NULL,
 UNIQUE(tenant_id,id),
 UNIQUE(tenant_id,client_mutation_id),
 FOREIGN KEY(tenant_id,channel_id) REFERENCES sinea.school_channels(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.school_announcements (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 school_id uuid NOT NULL,
 channel_id uuid,
 title text NOT NULL,
 body_object_key text NOT NULL,
 authored_by_subject text NOT NULL,
 approved_by_subject text,
 approved_at timestamptz,
 published_at timestamptz,
 version integer NOT NULL DEFAULT 1 CHECK(version>0),
 state text NOT NULL DEFAULT 'draft'
  CHECK(state IN ('draft','approved','published','archived')),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,school_id) REFERENCES sinea.schools(tenant_id,id),
 FOREIGN KEY(tenant_id,channel_id) REFERENCES sinea.school_channels(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.announcement_receipts (
 tenant_id uuid NOT NULL,
 announcement_id uuid NOT NULL,
 student_id uuid NOT NULL,
 guardian_subject text NOT NULL,
 read_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(tenant_id,announcement_id,student_id,guardian_subject),
 FOREIGN KEY(tenant_id,announcement_id) REFERENCES sinea.school_announcements(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.family_daily_summaries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 daily_record_id uuid NOT NULL,
 summary_object_key text NOT NULL,
 revised_by_membership_id uuid NOT NULL,
 revised_at timestamptz NOT NULL DEFAULT now(),
 published_at timestamptz,
 state text NOT NULL DEFAULT 'awaiting_publication'
  CHECK(state IN ('awaiting_publication','approved','published','revoked')),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
 FOREIGN KEY(tenant_id,daily_record_id) REFERENCES sinea.daily_records(tenant_id,id),
 FOREIGN KEY(tenant_id,revised_by_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.family_authorizations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 authorization_kind text NOT NULL,
 requested_by_membership_id uuid NOT NULL,
 request_document_key text NOT NULL,
 guardian_subject text,
 decision text NOT NULL DEFAULT 'pending'
  CHECK(decision IN ('pending','approved','declined','revoked')),
 decided_at timestamptz,
 expires_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
 FOREIGN KEY(tenant_id,requested_by_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
DO $$
DECLARE tbl text;
BEGIN
 FOREACH tbl IN ARRAY ARRAY['guardianships','school_channels','school_messages',
 'school_announcements','announcement_receipts','family_daily_summaries','family_authorizations']
 LOOP
  EXECUTE format('ALTER TABLE sinea.%I ENABLE ROW LEVEL SECURITY',tbl);
  EXECUTE format('ALTER TABLE sinea.%I FORCE ROW LEVEL SECURITY',tbl);
 END LOOP;
END $$;
COMMIT;
