-- SINEA schema foundation / migration 001 (PostgreSQL 15+).
-- NO DATA. REVIEW REQUIRED before production: NO application GRANTS or RLS allow policies.
-- Public GitHub repository: never include credentials, actual medical files, student records.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS sinea;

CREATE TABLE IF NOT EXISTS sinea.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind text NOT NULL CHECK(kind IN ('municipal','estadual','federal','mantenedora','escola_privada')),
  region_code text,
  status text NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended','closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sinea.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES sinea.tenants(id),
  name text NOT NULL,
  school_code text,
  municipality text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id,id),
  UNIQUE(tenant_id,school_code)
);

CREATE TABLE IF NOT EXISTS sinea.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES sinea.tenants(id),
  school_id uuid,
  identity_subject text NOT NULL,
  role text NOT NULL CHECK(role IN (
    'aee','regente','mediador','coordenacao','secretaria','especialista',
    'consultor_evoluce','admin_evoluce','responsavel'
  )),
  status text NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended','revoked')),
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_to timestamptz,
  UNIQUE(tenant_id,id),
  FOREIGN KEY(tenant_id,school_id) REFERENCES sinea.schools(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS memberships_subject_idx ON sinea.memberships(identity_subject,tenant_id) WHERE status='active';

CREATE TABLE IF NOT EXISTS sinea.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES sinea.tenants(id),
  school_id uuid NOT NULL,
  display_name text NOT NULL,
  birth_date date,
  registration_code text,
  current_class text,
  enrollment_status text NOT NULL DEFAULT 'active' CHECK(enrollment_status IN ('active','transferred','inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id,id),
  UNIQUE(tenant_id,registration_code),
  FOREIGN KEY(tenant_id,school_id) REFERENCES sinea.schools(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS students_school_idx ON sinea.students(tenant_id,school_id);

CREATE TABLE IF NOT EXISTS sinea.student_professional_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  student_id uuid NOT NULL,
  membership_id uuid NOT NULL,
  relationship_kind text NOT NULL CHECK(relationship_kind IN ('aee','regente','mediador','coordenacao','apoio')),
  valid_from date NOT NULL DEFAULT CURRENT_DATE,
  valid_to date,
  UNIQUE(tenant_id,id),
  FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
  FOREIGN KEY(tenant_id,membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS links_student_idx ON sinea.student_professional_links(tenant_id,student_id);

CREATE TABLE IF NOT EXISTS sinea.student_supports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  student_id uuid NOT NULL,
  support_kind text NOT NULL,
  description text NOT NULL,
  last_reviewed_at timestamptz,
  UNIQUE(tenant_id,id),
  FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);

CREATE TABLE IF NOT EXISTS sinea.student_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  student_id uuid NOT NULL,
  document_kind text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  issued_on date,
  storage_object_key text NOT NULL,
  encrypted_key_reference text,
  sha256_hex char(64),
  size_bytes bigint CHECK(size_bytes >= 0),
  mime_type text NOT NULL CHECK(mime_type IN ('application/pdf','image/jpeg','image/png','image/webp')),
  confidentiality text NOT NULL DEFAULT 'clinical' CHECK(confidentiality IN ('clinical','pedagogical')),
  UNIQUE(tenant_id,id),
  FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS documents_student_idx ON sinea.student_documents(tenant_id,student_id);

CREATE TABLE IF NOT EXISTS sinea.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  student_id uuid NOT NULL,
  kind text NOT NULL CHECK(kind IN ('PEI','PDI','PAEE')),
  school_year integer NOT NULL CHECK(school_year BETWEEN 2000 AND 2150),
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','approved','archived')),
  version integer NOT NULL DEFAULT 1 CHECK(version > 0),
  next_review_on date,
  approved_at timestamptz,
  approved_by_subject text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id,id),
  FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS plans_student_idx ON sinea.plans(tenant_id,student_id,school_year);

CREATE TABLE IF NOT EXISTS sinea.plan_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  area text NOT NULL,
  measurable_goal text NOT NULL,
  strategy text,
  support_resources text,
  due_on date,
  responsible_membership_id uuid,
  progress_percent numeric(5,2) CHECK(progress_percent BETWEEN 0 AND 100),
  progress_rubric text,
  status text NOT NULL DEFAULT 'active',
  UNIQUE(tenant_id,id),
  FOREIGN KEY(tenant_id,plan_id) REFERENCES sinea.plans(tenant_id,id),
  FOREIGN KEY(tenant_id,responsible_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);

CREATE TABLE IF NOT EXISTS sinea.plan_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  version integer NOT NULL CHECK(version > 0),
  snapshot jsonb NOT NULL,
  changed_by_subject text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id,plan_id,version),
  FOREIGN KEY(tenant_id,plan_id) REFERENCES sinea.plans(tenant_id,id)
);

CREATE TABLE IF NOT EXISTS sinea.agenda_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  school_id uuid NOT NULL,
  student_id uuid,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  kind text NOT NULL,
  location text,
  assigned_membership_id uuid,
  status text NOT NULL DEFAULT 'scheduled',
  visual_symbol_key text,
  changed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id,id),
  CHECK(ends_at > starts_at),
  FOREIGN KEY(tenant_id,school_id) REFERENCES sinea.schools(tenant_id,id),
  FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
  FOREIGN KEY(tenant_id,assigned_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS agenda_school_date_idx ON sinea.agenda_events(tenant_id,school_id,starts_at);

CREATE TABLE IF NOT EXISTS sinea.daily_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  student_id uuid NOT NULL,
  agenda_event_id uuid,
  plan_goal_id uuid,
  author_membership_id uuid NOT NULL,
  modality text NOT NULL,
  occurred_at timestamptz NOT NULL,
  activity_description text NOT NULL,
  participation smallint CHECK(participation BETWEEN 1 AND 5),
  observations text,
  support_markers text[] NOT NULL DEFAULT '{}',
  plan_adjustment text,
  version integer NOT NULL DEFAULT 1 CHECK(version > 0),
  client_mutation_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id,id),
  UNIQUE(tenant_id,client_mutation_id),
  FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
  FOREIGN KEY(tenant_id,agenda_event_id) REFERENCES sinea.agenda_events(tenant_id,id),
  FOREIGN KEY(tenant_id,plan_goal_id) REFERENCES sinea.plan_goals(tenant_id,id),
  FOREIGN KEY(tenant_id,author_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE INDEX IF NOT EXISTS daily_records_student_date_idx ON sinea.daily_records(tenant_id,student_id,occurred_at DESC);

CREATE TABLE IF NOT EXISTS sinea.calm_item_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES sinea.tenants(id),
  name text NOT NULL,
  category text NOT NULL,
  icon_key text,
  active boolean NOT NULL DEFAULT true,
  UNIQUE(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.calm_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  student_id uuid NOT NULL,
  accompanied_by_membership_id uuid NOT NULL,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  duration_seconds integer CHECK(duration_seconds >= 0),
  before_triggers text[] NOT NULL DEFAULT '{}',
  entry_scale smallint CHECK(entry_scale BETWEEN 1 AND 5),
  exit_scale smallint CHECK(exit_scale BETWEEN 1 AND 5),
  outcome text CHECK(outcome IN ('melhorou','igual','piorou')),
  return_to_activity text CHECK(return_to_activity IN ('sim','nao','parcialmente')),
  observations text,
  client_mutation_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id,id),
  UNIQUE(tenant_id,client_mutation_id),
  CHECK(ended_at IS NULL OR ended_at >= started_at),
  FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
  FOREIGN KEY(tenant_id,accompanied_by_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.calm_session_items (
  tenant_id uuid NOT NULL,
  calm_session_id uuid NOT NULL,
  calm_item_id uuid NOT NULL,
  PRIMARY KEY(tenant_id,calm_session_id,calm_item_id),
  FOREIGN KEY(tenant_id,calm_session_id) REFERENCES sinea.calm_sessions(tenant_id,id),
  FOREIGN KEY(tenant_id,calm_item_id) REFERENCES sinea.calm_item_catalog(tenant_id,id)
);

CREATE TABLE IF NOT EXISTS sinea.student_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  student_id uuid NOT NULL,
  from_school_id uuid NOT NULL,
  to_school_id uuid NOT NULL,
  requested_by_subject text NOT NULL,
  approved_by_subject text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','approved','rejected','completed')),
  justification text,
  UNIQUE(tenant_id,id),
  CHECK(from_school_id <> to_school_id),
  FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
  FOREIGN KEY(tenant_id,from_school_id) REFERENCES sinea.schools(tenant_id,id),
  FOREIGN KEY(tenant_id,to_school_id) REFERENCES sinea.schools(tenant_id,id)
);

CREATE TABLE IF NOT EXISTS sinea.student_licenses (
  tenant_id uuid NOT NULL,
  student_id uuid NOT NULL,
  license_status text NOT NULL DEFAULT 'active' CHECK(license_status IN ('active','suspended','ended')),
  activated_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  PRIMARY KEY(tenant_id,student_id),
  FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);

CREATE TABLE IF NOT EXISTS sinea.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES sinea.tenants(id),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_subject text,
  actor_role text,
  action text NOT NULL,
  resource_kind text NOT NULL,
  resource_id uuid,
  originating_ip inet,
  outcome text NOT NULL,
  trace_id uuid,
  details_redacted jsonb NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS audit_tenant_time_idx ON sinea.audit_events(tenant_id,occurred_at DESC);
CREATE FUNCTION sinea.prevent_audit_mutation() RETURNS trigger
  LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Audit rows cannot be updated or deleted'; END $$;
CREATE TRIGGER audit_append_only BEFORE UPDATE OR DELETE ON sinea.audit_events
  FOR EACH ROW EXECUTE FUNCTION sinea.prevent_audit_mutation();

-- No application role grants. Fail closed until role/student-scoped RLS policies,
-- authenticated API authorization, cross-tenant tests and DPA/RIPD are complete.
-- FORCE RLS also protects table owners from inadvertently reading records.
DO $$
DECLARE tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'tenants','schools','memberships','students','student_professional_links',
    'student_supports','student_documents','plans','plan_goals','plan_versions',
    'agenda_events','daily_records','calm_item_catalog','calm_sessions',
    'calm_session_items','student_transfers','student_licenses','audit_events'
  ]
  LOOP
    EXECUTE format('ALTER TABLE sinea.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('ALTER TABLE sinea.%I FORCE ROW LEVEL SECURITY', tbl);
  END LOOP;
END $$;
COMMIT;
