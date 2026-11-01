-- SINEA 003: domain completeness scaffolding. NO GRANTS and NO student data.
-- Operational use requires explicit legal, RLS and API reviews. All new tables forced RLS.
BEGIN;
CREATE TABLE IF NOT EXISTS sinea.school_classes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 school_id uuid NOT NULL,
 academic_year integer NOT NULL CHECK(academic_year BETWEEN 2000 AND 2150),
 label text NOT NULL,
 educational_stage text NOT NULL CHECK(educational_stage IN ('infantil','fundamental_i','fundamental_ii','medio')),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,school_id) REFERENCES sinea.schools(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.enrollments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 class_id uuid NOT NULL,
 started_on date NOT NULL,
 ended_on date,
 UNIQUE(tenant_id,id),
 CHECK(ended_on IS NULL OR ended_on >= started_on),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
 FOREIGN KEY(tenant_id,class_id) REFERENCES sinea.school_classes(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.case_studies (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 authored_by_membership_id uuid NOT NULL,
 version integer NOT NULL DEFAULT 1 CHECK(version>0),
 barriers text,
 strengths text,
 educational_supports text,
 communication_preferences text,
 review_on date,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
 FOREIGN KEY(tenant_id,authored_by_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.publisher_projects (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL,
 edition text NOT NULL,
 enabled boolean NOT NULL DEFAULT false,
 owner_name text NOT NULL,
 catalog_version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sinea.publisher_materials (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 project_id uuid REFERENCES sinea.publisher_projects(id),
 title text NOT NULL,
 edition text NOT NULL,
 copyright_holder text NOT NULL,
 storage_object_key text NOT NULL,
 review_state text NOT NULL DEFAULT 'draft'
   CHECK(review_state IN ('draft','review','approved','withdrawn')),
 reviewed_by_subject text,
 reviewed_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sinea.publisher_material_bncc (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 material_id uuid NOT NULL REFERENCES sinea.publisher_materials(id),
 code text NOT NULL,
 curriculum_edition text NOT NULL,
 component text NOT NULL,
 rationale text NOT NULL,
 reviewed_by_subject text NOT NULL,
 reviewed_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(material_id,code,curriculum_edition)
);
CREATE TABLE IF NOT EXISTS sinea.publisher_licenses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL REFERENCES sinea.tenants(id),
 material_id uuid REFERENCES sinea.publisher_materials(id),
 project_id uuid REFERENCES sinea.publisher_projects(id),
 license_mode text NOT NULL CHECK(license_mode IN ('full_sinea','planning_only')),
 starts_on date NOT NULL,
 ends_on date,
 state text NOT NULL DEFAULT 'active' CHECK(state IN ('active','suspended','expired')),
 UNIQUE(tenant_id,id),
 CHECK(ends_on IS NULL OR ends_on >= starts_on),
 CHECK(material_id IS NOT NULL OR project_id IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS sinea.activity_assignments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 material_id uuid REFERENCES sinea.publisher_materials(id),
 goal_id uuid,
 assigned_by_membership_id uuid NOT NULL,
 assigned_at timestamptz NOT NULL DEFAULT now(),
 due_on date,
 status text NOT NULL DEFAULT 'assigned' CHECK(status IN ('assigned','paused','completed','canceled')),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
 FOREIGN KEY(tenant_id,goal_id) REFERENCES sinea.plan_goals(tenant_id,id),
 FOREIGN KEY(tenant_id,assigned_by_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.activity_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 assignment_id uuid NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT now(),
 selected_options jsonb,
 participation_note text,
 reviewed_by_membership_id uuid,
 reviewed_at timestamptz,
 client_mutation_id uuid NOT NULL,
 UNIQUE(tenant_id,id),
 UNIQUE(tenant_id,client_mutation_id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
 FOREIGN KEY(tenant_id,assignment_id) REFERENCES sinea.activity_assignments(tenant_id,id),
 FOREIGN KEY(tenant_id,reviewed_by_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.evidence_attachments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 daily_record_id uuid,
 object_key text NOT NULL,
 encrypted_key_reference text,
 mime_type text NOT NULL CHECK(mime_type IN ('image/png','image/jpeg','image/webp','application/pdf')),
 byte_size bigint NOT NULL CHECK(byte_size>0),
 content_sha256 char(64),
 uploaded_by_membership_id uuid NOT NULL,
 captured_without_face_confirmation boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
 FOREIGN KEY(tenant_id,daily_record_id) REFERENCES sinea.daily_records(tenant_id,id),
 FOREIGN KEY(tenant_id,uploaded_by_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.calm_support_menus (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 suggested_items jsonb NOT NULL DEFAULT '[]',
 confirmed_items jsonb NOT NULL DEFAULT '[]',
 reviewed_by_membership_id uuid,
 reviewed_at timestamptz,
 status text NOT NULL DEFAULT 'suggestion' CHECK(status IN ('suggestion','confirmed','archived')),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id),
 FOREIGN KEY(tenant_id,reviewed_by_membership_id) REFERENCES sinea.memberships(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.notification_outbox (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL REFERENCES sinea.tenants(id),
 recipient_subject text NOT NULL,
 template_key text NOT NULL CHECK(template_key IN
   ('plan_review','appointment','document_pending','calm_followup')),
 scheduled_at timestamptz NOT NULL,
 delivery_status text NOT NULL DEFAULT 'pending',
 sent_at timestamptz,
 -- NO personal student names or diagnostic text in push payload
 UNIQUE(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.offline_mutations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 client_mutation_id uuid NOT NULL,
 entity_kind text NOT NULL CHECK(entity_kind IN ('daily_record','calm_session')),
 entity_id uuid NOT NULL,
 base_version integer NOT NULL CHECK(base_version>=0),
 payload_hash char(64) NOT NULL,
 received_at timestamptz NOT NULL DEFAULT now(),
 state text NOT NULL DEFAULT 'received' CHECK(state IN ('received','applied','conflict','rejected')),
 conflict_detail_code text,
 UNIQUE(tenant_id,id),
 UNIQUE(tenant_id,client_mutation_id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.retention_rules (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL REFERENCES sinea.tenants(id),
 record_class text NOT NULL,
 retention_days integer NOT NULL CHECK(retention_days>=1),
 legal_basis text NOT NULL,
 approved_by_controller_subject text NOT NULL,
 approved_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,record_class),
 UNIQUE(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.data_subject_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 student_id uuid NOT NULL,
 request_kind text NOT NULL CHECK(request_kind IN ('access','correction','portability','deletion')),
 state text NOT NULL DEFAULT 'submitted' CHECK(state IN ('submitted','verified','processing','completed','denied')),
 controller_approval_subject text,
 justification_code text,
 created_at timestamptz NOT NULL DEFAULT now(),
 completed_at timestamptz,
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.ai_curated_sources (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid REFERENCES sinea.tenants(id),
 project_id uuid REFERENCES sinea.publisher_projects(id),
 title text NOT NULL,
 storage_object_key text NOT NULL,
 approved_by_subject text,
 approved_at timestamptz,
 version integer NOT NULL DEFAULT 1,
 state text NOT NULL DEFAULT 'draft' CHECK(state IN ('draft','approved','withdrawn'))
);
CREATE TABLE IF NOT EXISTS sinea.ai_suggestions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL REFERENCES sinea.tenants(id),
 student_id uuid,
 actor_subject text NOT NULL,
 mode text NOT NULL CHECK(mode IN ('student_adaptation','general_planning')),
 agent_version text NOT NULL,
 source_ids uuid[] NOT NULL DEFAULT '{}',
 pseudonymized_input_hash char(64) NOT NULL,
 output_storage_key text NOT NULL,
 reviewer_subject text,
 review_state text NOT NULL DEFAULT 'pending' CHECK(review_state IN ('pending','approved','rejected')),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,id),
 CHECK((mode='general_planning' AND student_id IS NULL)
       OR (mode='student_adaptation' AND student_id IS NOT NULL)),
 FOREIGN KEY(tenant_id,student_id) REFERENCES sinea.students(tenant_id,id)
);
CREATE TABLE IF NOT EXISTS sinea.ai_feedback (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 tenant_id uuid NOT NULL,
 suggestion_id uuid NOT NULL,
 reviewer_subject text NOT NULL,
 helpfulness text NOT NULL CHECK(helpfulness IN ('funcionou','parcialmente','nao_funcionou')),
 comment_redacted text,
 recorded_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(tenant_id,id),
 FOREIGN KEY(tenant_id,suggestion_id) REFERENCES sinea.ai_suggestions(tenant_id,id)
);

-- Each added entity is tenant-contained or publisher-only and starts DENY ALL.
DO $$
DECLARE tbl text;
BEGIN
 FOREACH tbl IN ARRAY ARRAY[
   'school_classes','enrollments','case_studies','publisher_projects',
   'publisher_materials','publisher_material_bncc','publisher_licenses',
   'activity_assignments','activity_sessions','evidence_attachments',
   'calm_support_menus','notification_outbox','offline_mutations',
   'retention_rules','data_subject_requests','ai_curated_sources',
   'ai_suggestions','ai_feedback'
 ]
 LOOP
   EXECUTE format('ALTER TABLE sinea.%I ENABLE ROW LEVEL SECURITY',tbl);
   EXECUTE format('ALTER TABLE sinea.%I FORCE ROW LEVEL SECURITY',tbl);
 END LOOP;
END $$;
COMMIT;
