DO $$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM pg_class c JOIN pg_namespace s ON s.oid=c.relnamespace
 WHERE s.nspname='sinea' AND c.relkind='r' AND c.relrowsecurity AND c.relforcerowsecurity;
 IF n<43 THEN RAISE EXCEPTION 'Expected 43 forced-RLS tables; found %',n; END IF;
 IF has_table_privilege('sinea_api','sinea.school_messages','SELECT')
  OR has_table_privilege('sinea_api','sinea.guardianships','SELECT')
  OR has_table_privilege('sinea_api','sinea.family_daily_summaries','SELECT')
 THEN RAISE EXCEPTION 'Family data grants must remain blocked until approved policies'; END IF;
 RAISE NOTICE '% protected SINEA tables; family communication denied by default',n;
END $$;
