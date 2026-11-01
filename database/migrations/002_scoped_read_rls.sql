-- SINEA 002: minimum read-only RLS in PostgreSQL.
-- Requires reviewed identity from API, no direct DB clients, no app write grants.
-- SECURITY NOTE: Custom session settings are supplied only by trusted server code.
-- Do not use a superuser/BYPASSRLS credential for the API runtime.
BEGIN;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='sinea_api') THEN
    CREATE ROLE sinea_api NOLOGIN;
  END IF;
END $$;
GRANT USAGE ON SCHEMA sinea TO sinea_api;

CREATE OR REPLACE FUNCTION sinea.current_tenant() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('sinea.tenant_id',true),'')::uuid
$$;
CREATE OR REPLACE FUNCTION sinea.current_actor() RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('sinea.actor_subject',true),'')
$$;

CREATE POLICY sinea_memberships_self ON sinea.memberships
FOR SELECT TO sinea_api
USING (
  tenant_id = sinea.current_tenant()
  AND identity_subject = sinea.current_actor()
  AND status='active'
  AND valid_from<=now()
  AND (valid_to IS NULL OR valid_to>now())
);
GRANT SELECT ON sinea.memberships TO sinea_api;

CREATE POLICY sinea_tenants_own ON sinea.tenants
FOR SELECT TO sinea_api
USING (id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.memberships m WHERE m.tenant_id=id
));
GRANT SELECT ON sinea.tenants TO sinea_api;

CREATE POLICY sinea_schools_assigned ON sinea.schools
FOR SELECT TO sinea_api
USING (
  tenant_id=sinea.current_tenant() AND EXISTS (
    SELECT 1 FROM sinea.memberships m
    WHERE m.tenant_id=schools.tenant_id
      AND (m.school_id=schools.id OR m.role='secretaria')
  )
);
GRANT SELECT ON sinea.schools TO sinea_api;

CREATE POLICY sinea_links_current_actor ON sinea.student_professional_links
FOR SELECT TO sinea_api
USING (
  tenant_id=sinea.current_tenant()
  AND valid_from<=CURRENT_DATE
  AND (valid_to IS NULL OR valid_to>=CURRENT_DATE)
  AND EXISTS (
    SELECT 1 FROM sinea.memberships m
    WHERE m.tenant_id=student_professional_links.tenant_id
      AND m.id=student_professional_links.membership_id
      AND m.role IN ('aee','regente','mediador','coordenacao')
  )
);
GRANT SELECT ON sinea.student_professional_links TO sinea_api;

CREATE POLICY sinea_students_assigned ON sinea.students
FOR SELECT TO sinea_api
USING (
  tenant_id=sinea.current_tenant()
  AND enrollment_status='active'
  AND EXISTS (
    SELECT 1 FROM sinea.memberships m
    WHERE m.tenant_id=students.tenant_id
      AND (
        (m.role='coordenacao' AND m.school_id=students.school_id)
        OR (m.role IN ('aee','regente','mediador')
           AND m.school_id=students.school_id
           AND EXISTS (
             SELECT 1 FROM sinea.student_professional_links l
             WHERE l.tenant_id=students.tenant_id
               AND l.student_id=students.id
               AND l.membership_id=m.id
           ))
      )
  )
);
GRANT SELECT ON sinea.students TO sinea_api;

CREATE POLICY sinea_supports_assigned ON sinea.student_supports
FOR SELECT TO sinea_api
USING (tenant_id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.students s
  WHERE s.tenant_id=student_supports.tenant_id AND s.id=student_supports.student_id
));
GRANT SELECT ON sinea.student_supports TO sinea_api;

CREATE POLICY sinea_documents_scoped ON sinea.student_documents
FOR SELECT TO sinea_api
USING (
  tenant_id=sinea.current_tenant()
  AND (
    (confidentiality='pedagogical' AND EXISTS (
      SELECT 1 FROM sinea.students s
      WHERE s.tenant_id=student_documents.tenant_id AND s.id=student_documents.student_id
    ))
    OR
    (confidentiality='clinical' AND EXISTS (
      SELECT 1 FROM sinea.memberships m
      JOIN sinea.student_professional_links l ON
        l.tenant_id=m.tenant_id AND l.membership_id=m.id
      WHERE m.tenant_id=student_documents.tenant_id AND m.role='aee'
        AND l.student_id=student_documents.student_id
    ))
  )
);
GRANT SELECT ON sinea.student_documents TO sinea_api;

CREATE POLICY sinea_plans_assigned ON sinea.plans
FOR SELECT TO sinea_api
USING (tenant_id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.students s
  WHERE s.tenant_id=plans.tenant_id AND s.id=plans.student_id
));
GRANT SELECT ON sinea.plans TO sinea_api;

CREATE POLICY sinea_plan_goals_scoped ON sinea.plan_goals
FOR SELECT TO sinea_api
USING (tenant_id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.plans p
  WHERE p.tenant_id=plan_goals.tenant_id AND p.id=plan_goals.plan_id
));
GRANT SELECT ON sinea.plan_goals TO sinea_api;

CREATE POLICY sinea_plan_versions_scoped ON sinea.plan_versions
FOR SELECT TO sinea_api
USING (tenant_id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.plans p
  WHERE p.tenant_id=plan_versions.tenant_id AND p.id=plan_versions.plan_id
));
GRANT SELECT ON sinea.plan_versions TO sinea_api;

CREATE POLICY sinea_agenda_scoped ON sinea.agenda_events
FOR SELECT TO sinea_api
USING (
  tenant_id=sinea.current_tenant()
  AND (
    (student_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM sinea.students s
      WHERE s.tenant_id=agenda_events.tenant_id AND s.id=agenda_events.student_id
    ))
    OR (student_id IS NULL AND EXISTS (
      SELECT 1 FROM sinea.memberships m
      WHERE m.tenant_id=agenda_events.tenant_id
        AND m.school_id=agenda_events.school_id
        AND m.role='coordenacao'
    ))
  )
);
GRANT SELECT ON sinea.agenda_events TO sinea_api;

CREATE POLICY sinea_daily_records_scoped ON sinea.daily_records
FOR SELECT TO sinea_api
USING (tenant_id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.students s
  WHERE s.tenant_id=daily_records.tenant_id AND s.id=daily_records.student_id
));
GRANT SELECT ON sinea.daily_records TO sinea_api;

CREATE POLICY sinea_calm_items_tenant ON sinea.calm_item_catalog
FOR SELECT TO sinea_api
USING (tenant_id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.memberships m WHERE m.tenant_id=calm_item_catalog.tenant_id
));
GRANT SELECT ON sinea.calm_item_catalog TO sinea_api;

CREATE POLICY sinea_calm_sessions_scoped ON sinea.calm_sessions
FOR SELECT TO sinea_api
USING (tenant_id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.students s
  WHERE s.tenant_id=calm_sessions.tenant_id AND s.id=calm_sessions.student_id
));
GRANT SELECT ON sinea.calm_sessions TO sinea_api;

CREATE POLICY sinea_calm_session_items_scoped ON sinea.calm_session_items
FOR SELECT TO sinea_api
USING (tenant_id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.calm_sessions c
  WHERE c.tenant_id=calm_session_items.tenant_id
    AND c.id=calm_session_items.calm_session_id
));
GRANT SELECT ON sinea.calm_session_items TO sinea_api;

CREATE POLICY sinea_transfers_assigned ON sinea.student_transfers
FOR SELECT TO sinea_api
USING (tenant_id=sinea.current_tenant() AND EXISTS (
  SELECT 1 FROM sinea.students s
  WHERE s.tenant_id=student_transfers.tenant_id AND s.id=student_transfers.student_id
));
GRANT SELECT ON sinea.student_transfers TO sinea_api;

-- License and append-only audit data remain inaccessible to the application role.
-- No INSERT/UPDATE/DELETE permissions are granted to sinea_api.
COMMIT;
