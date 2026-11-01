-- CI-only metadata assertions, no student data.
DO $$
DECLARE count_all integer;
DECLARE count_hardened integer;
BEGIN
  SELECT count(*) INTO count_all
  FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='sinea' AND c.relkind='r';
  SELECT count(*) INTO count_hardened
  FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='sinea' AND c.relkind='r'
    AND c.relrowsecurity AND c.relforcerowsecurity;
  IF count_all < 18 THEN
    RAISE EXCEPTION 'Expected at least 18 SINEA tables, found %', count_all;
  END IF;
  IF count_all <> count_hardened THEN
    RAISE EXCEPTION 'RLS not enabled and forced on all tables (% / %)', count_hardened, count_all;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='sinea'
      AND (qual IS NULL OR qual <> 'false')
  ) THEN
    RAISE EXCEPTION 'Unexpected permissive RLS policy in schema under construction';
  END IF;
  RAISE NOTICE 'SINEA schema: % tables with forced RLS, no permissive application policies',count_all;
END $$;
