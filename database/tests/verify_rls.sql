-- SINEA RLS structural checks: forced on all base tables, no broad access to clinical records.
DO $$
DECLARE n_total integer;
DECLARE n_rls integer;
DECLARE n_select_policies integer;
BEGIN
  SELECT count(*) INTO n_total FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='sinea' AND c.relkind='r';
  SELECT count(*) INTO n_rls FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='sinea' AND c.relkind='r'
    AND c.relrowsecurity AND c.relforcerowsecurity;
  SELECT count(*) INTO n_select_policies FROM pg_policies
  WHERE schemaname='sinea' AND cmd='SELECT' AND 'sinea_api'=ANY(roles);
  IF n_total < 18 OR n_total<>n_rls THEN
    RAISE EXCEPTION 'SINEA forced RLS missing: % of %',n_rls,n_total;
  END IF;
  IF n_select_policies < 14 THEN
    RAISE EXCEPTION 'Expected scoped read policies, found %',n_select_policies;
  END IF;
  IF has_table_privilege('sinea_api','sinea.students','INSERT')
     OR has_table_privilege('sinea_api','sinea.students','UPDATE')
     OR has_table_privilege('sinea_api','sinea.student_documents','INSERT')
     OR has_table_privilege('sinea_api','sinea.audit_events','SELECT')
  THEN
    RAISE EXCEPTION 'Unexpected application privilege';
  END IF;
  RAISE NOTICE 'SINEA RLS enforced: % tables, % scoped policies, no writes',n_total,n_select_policies;
END $$;
