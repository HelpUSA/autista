/**
 * Política de AUTORIZAÇÃO de referência para o backend SINEA.
 * IMPORTANTE: executar SOMENTE no servidor sobre memberships e vínculos
 * consultados do banco. Nunca confiar nesses objetos vindos do navegador/JWT.
 * Falha fechada. Não equivale a autenticação ou RLS implementadas.
 */

export const OPERATIONS=Object.freeze({
  AGGREGATES:'network.aggregates.read',
  SCHOOL_DASHBOARD:'school.dashboard.read',
  STUDENT_PEDAGOGICAL:'student.pedagogical.read',
  STUDENT_CLINICAL:'student.clinical.read',
  PLAN_READ:'plan.read',
  PLAN_EDIT:'plan.edit',
  RECORD_CREATE:'daily.create',
  CALM_CREATE:'calm.create',
  TRANSFER:'student.transfer.request',
  PROJECT_PLANNING:'project.plan',
  AGENT_CURATION:'agent.curate',
  TENANT_ADMIN:'tenant.manage'
});

const globalNoStudent = new Map([
  [OPERATIONS.PROJECT_PLANNING,new Set(['consultor_evoluce'])],
  [OPERATIONS.AGENT_CURATION,new Set(['especialista'])],
  [OPERATIONS.TENANT_ADMIN,new Set(['admin_evoluce'])]
]);

function activeMemberships(actor,tenantId) {
  if (!actor?.subject || !tenantId || !Array.isArray(actor?.memberships)) return [];
  return actor.memberships.filter(m=>m?.tenantId===tenantId && m.status==='active' && m.role);
}

function studentAssignmentMembership(m,student) {
  const linked=Array.isArray(m.assignedStudentIds) && m.assignedStudentIds.includes(student.id);
  return linked && (!m.schoolId || m.schoolId === student.schoolId);
}

export function authorizeSinea({actor,action,tenantId,student=null}) {
  if (!action || !tenantId) return false;
  const memberships=activeMemberships(actor,tenantId);
  if (!memberships.length) return false;

  // Editora / especialista / administração não têm acesso nominal, por padrão.
  if (globalNoStudent.has(action)) {
    return !student && memberships.some(m=>globalNoStudent.get(action).has(m.role));
  }
  if (action===OPERATIONS.AGGREGATES) {
    return !student && memberships.some(m=>['secretaria','coordenacao'].includes(m.role));
  }
  if (action===OPERATIONS.SCHOOL_DASHBOARD) {
    return !student && memberships.some(m=>m.role==='coordenacao' && m.schoolId);
  }

  // Operações nominais: vínculo real + rede e escola compatíveis.
  if (!student?.id || !student?.schoolId || student.tenantId!==tenantId) return false;

  return memberships.some(m=>{
    if (m.role==='aee' && studentAssignmentMembership(m,student)) {
      return [
        OPERATIONS.STUDENT_PEDAGOGICAL,OPERATIONS.STUDENT_CLINICAL,
        OPERATIONS.PLAN_READ,OPERATIONS.PLAN_EDIT,
        OPERATIONS.RECORD_CREATE,OPERATIONS.CALM_CREATE
      ].includes(action);
    }
    if (m.role==='regente' && studentAssignmentMembership(m,student)) {
      return [OPERATIONS.STUDENT_PEDAGOGICAL,OPERATIONS.PLAN_READ,
        OPERATIONS.RECORD_CREATE,OPERATIONS.CALM_CREATE].includes(action);
    }
    if (m.role==='mediador' && studentAssignmentMembership(m,student)) {
      return [OPERATIONS.PLAN_READ,OPERATIONS.RECORD_CREATE,
        OPERATIONS.CALM_CREATE].includes(action);
    }
    if (m.role==='coordenacao' && m.schoolId===student.schoolId) {
      return [OPERATIONS.STUDENT_PEDAGOGICAL,OPERATIONS.PLAN_READ,
        OPERATIONS.PLAN_EDIT,OPERATIONS.TRANSFER].includes(action);
    }
    // Secretaria nominal demanda fluxo excepcional separado, com justificativa,
    // aprovação, expiração de acesso e auditoria. Não liberar no caminho padrão.
    return false;
  });
}
