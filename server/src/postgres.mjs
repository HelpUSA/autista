import pg from 'pg';

/**
 * Transitional PostgreSQL adapter: does NOT bypass RLS. Migration 001 leaves
 * all tables closed. Until reviewed RLS policies, no actor/student can be loaded.
 * Database access is server-only; connection MUST NOT use a superuser/bypassrls role.
 */
export function createPostgresRepository({connectionString,ssl}) {
  if(!connectionString)throw new Error('SINEA_DATABASE_URL obrigatório');
  const pool=new pg.Pool({connectionString,ssl,max:10,statement_timeout:5000,
    idleTimeoutMillis:10000,connectionTimeoutMillis:4000,application_name:'sinea-api'});
  return {
    async withActor({subject,tenantId},fn) {
      const client=await pool.connect();
      try {
        await client.query('BEGIN READ WRITE');
        await client.query("SELECT set_config('sinea.tenant_id', $1, true), set_config('sinea.actor_subject', $2, true)",[tenantId,subject]);
        await client.query("SET LOCAL statement_timeout = '5s'");
        const tx={
          async getActor() {
            const rows=(await client.query(`
              SELECT m.id, m.tenant_id AS "tenantId", m.school_id AS "schoolId",
                     m.role, m.status
              FROM sinea.memberships m
              WHERE m.identity_subject=$1 AND m.tenant_id=$2
                AND m.status='active' AND m.valid_from<=now()
                AND (m.valid_to IS NULL OR m.valid_to>now())`,[subject,tenantId])).rows;
            if(!rows.length)return null;
            const memberships=[];
            for(const m of rows) {
              const links=(await client.query(`
                SELECT student_id AS id FROM sinea.student_professional_links
                WHERE tenant_id=$1 AND membership_id=$2
                  AND valid_from<=current_date AND (valid_to IS NULL OR valid_to>=current_date)`,
                [tenantId,m.id])).rows;
              memberships.push({...m,assignedStudentIds:links.map(x=>x.id)});
            }
            return {subject,memberships};
          },
          async getStudent(id) {
            const result=await client.query(`
              SELECT id,tenant_id AS "tenantId",school_id AS "schoolId"
              FROM sinea.students WHERE id=$1 AND tenant_id=$2
                AND enrollment_status='active'`,[id,tenantId]);
            return result.rows[0]??null;
          },
          async listPlans(id) {
            const result=await client.query(`
              SELECT id,kind,school_year AS "schoolYear",status,version,
                next_review_on AS "nextReviewOn"
              FROM sinea.plans
              WHERE student_id=$1 AND tenant_id=$2
              ORDER BY school_year DESC,kind LIMIT 100`,[id,tenantId]);
            return result.rows;
          },
          async insertDailyRecord() {throw new Error('GRANTS/RLS for writes not yet audited');},
          async insertCalmSession() {throw new Error('GRANTS/RLS for writes not yet audited');}
        };
        const output=await fn(tx);
        await client.query('COMMIT');
        return output;
      }catch(err){
        await client.query('ROLLBACK').catch(()=>{});
        throw err;
      }finally{client.release();}
    },
    close:()=>pool.end()
  };
}
