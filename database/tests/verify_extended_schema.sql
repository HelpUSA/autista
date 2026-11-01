-- CI-only migration 003 presence and isolation check
DO $$
DECLARE found integer;
BEGIN
 SELECT count(*) INTO found
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='sinea' AND c.relkind='r'
   AND c.relrowsecurity AND c.relforcerowsecurity;
 IF found<36 THEN RAISE EXCEPTION 'Expected 36+ forced-RLS tables, got %',found; END IF;
 IF has_table_privilege('sinea_api','sinea.ai_suggestions','SELECT')
    OR has_table_privilege('sinea_api','sinea.evidence_attachments','SELECT')
    OR has_table_privilege('sinea_api','sinea.offline_mutations','INSERT')
 THEN RAISE EXCEPTION 'Unexpected access to new sensitive tables'; END IF;
 RAISE NOTICE 'SINEA migration 003: % protected base tables',found;
END $$;
