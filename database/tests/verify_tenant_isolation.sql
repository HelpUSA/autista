-- Synthetic cross-tenant and per-role RLS gate, executed by CI PostgreSQL superuser.
BEGIN;
INSERT INTO sinea.tenants(id,name,kind) VALUES
 ('11111111-1111-4111-8111-111111111111','Demo A','municipal'),
 ('22222222-2222-4222-8222-222222222222','Demo B','municipal');
INSERT INTO sinea.schools(id,tenant_id,name) VALUES
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','School A'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-222222222222','School B');
INSERT INTO sinea.students(id,tenant_id,school_id,display_name) VALUES
 ('cccccccc-cccc-4ccc-8ccc-cccccccccccc','11111111-1111-4111-8111-111111111111',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','ALUNO FICTICIO A'),
 ('dddddddd-dddd-4ddd-8ddd-dddddddddddd','22222222-2222-4222-8222-222222222222',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','ALUNO FICTICIO B');
INSERT INTO sinea.memberships(id,tenant_id,school_id,identity_subject,role) VALUES
 ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','11111111-1111-4111-8111-111111111111',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','ci:aee','aee'),
 ('ffffffff-ffff-4fff-8fff-ffffffffffff','11111111-1111-4111-8111-111111111111',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','ci:regente','regente'),
 ('99999999-9999-4999-8999-999999999999','11111111-1111-4111-8111-111111111111',
  NULL,'ci:secretaria','secretaria'),
 ('88888888-8888-4888-8888-888888888888','22222222-2222-4222-8222-222222222222',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','ci:aee-b','aee');
INSERT INTO sinea.student_professional_links(tenant_id,student_id,membership_id,relationship_kind)
VALUES
 ('11111111-1111-4111-8111-111111111111','cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','aee'),
 ('11111111-1111-4111-8111-111111111111','cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'ffffffff-ffff-4fff-8fff-ffffffffffff','regente'),
 ('22222222-2222-4222-8222-222222222222','dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  '88888888-8888-4888-8888-888888888888','aee');
INSERT INTO sinea.student_documents(tenant_id,student_id,document_kind,storage_object_key,mime_type,confidentiality)
VALUES
 ('11111111-1111-4111-8111-111111111111','cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'LAUDO_FICTICIO','fake/clinical.pdf','application/pdf','clinical'),
 ('11111111-1111-4111-8111-111111111111','cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'PLANO_PEDAGOGICO_FICTICIO','fake/plan.pdf','application/pdf','pedagogical');

SET LOCAL ROLE sinea_api;
SELECT set_config('sinea.tenant_id','11111111-1111-4111-8111-111111111111',true);
SELECT set_config('sinea.actor_subject','ci:aee',true);
DO $$BEGIN
 IF (SELECT count(*) FROM sinea.students) <> 1 THEN
  RAISE EXCEPTION 'AEE must see only assigned student';
 END IF;
 IF (SELECT count(*) FROM sinea.student_documents) <> 2 THEN
  RAISE EXCEPTION 'AEE must see only two permitted documents';
 END IF;
END $$;
SELECT set_config('sinea.actor_subject','ci:regente',true);
DO $$BEGIN
 IF (SELECT count(*) FROM sinea.students) <> 1 THEN
  RAISE EXCEPTION 'Regent must see assigned student';
 END IF;
 IF (SELECT count(*) FROM sinea.student_documents) <> 1 THEN
  RAISE EXCEPTION 'Regent must NOT see clinical documents';
 END IF;
END $$;
SELECT set_config('sinea.actor_subject','ci:secretaria',true);
DO $$BEGIN
 IF (SELECT count(*) FROM sinea.students) <> 0 THEN
  RAISE EXCEPTION 'Secretariat must NOT see named students';
 END IF;
 IF (SELECT count(*) FROM sinea.student_documents) <> 0 THEN
  RAISE EXCEPTION 'Secretariat must NOT see documents';
 END IF;
END $$;
SELECT set_config('sinea.actor_subject','ci:aee',true);
SELECT set_config('sinea.tenant_id','22222222-2222-4222-8222-222222222222',true);
DO $$BEGIN
 IF (SELECT count(*) FROM sinea.students) <> 0 THEN
  RAISE EXCEPTION 'Cross-tenant student leak';
 END IF;
 IF (SELECT count(*) FROM sinea.memberships) <> 0 THEN
  RAISE EXCEPTION 'Cross-tenant membership leak';
 END IF;
END $$;
ROLLBACK;
