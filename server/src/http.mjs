import { createServer } from 'node:http';
import { authorizeSinea, OPERATIONS } from '../../src/domain/accessPolicy.js';
import { validateDailyEntry } from '../../src/domain/sineaCore.js';
import { validateCalmSession } from '../../src/domain/calmAnalytics.js';

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const allowedHeaders={'content-type':'application/json; charset=utf-8',
  'cache-control':'no-store, private', 'x-content-type-options':'nosniff',
  'referrer-policy':'no-referrer','content-security-policy':"default-src 'none'; frame-ancestors 'none'"};

function respond(res,code,data) {
  res.writeHead(code,allowedHeaders);
  res.end(JSON.stringify(data));
}
class HttpError extends Error { constructor(status,message) {super(message);this.status=status;} }

async function parseJson(req,max=16*1024) {
  if(!String(req.headers['content-type']??'').toLowerCase().startsWith('application/json'))
    throw new HttpError(415,'É obrigatório Content-Type application/json');
  let length=0,chunks=[];
  for await (const chunk of req) {
    length+=chunk.length;
    if(length>max)throw new HttpError(413,'Conteúdo excede o limite');
    chunks.push(chunk);
  }
  try {const data=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if(!data || Array.isArray(data) || typeof data!=='object')throw new Error('invalid');
    return data;
  } catch {throw new HttpError(400,'JSON inválido');}
}

function requireBearer(req) {
  const v=req.headers.authorization;
  if(typeof v!=='string' || !/^Bearer [A-Za-z0-9._~+\/-]+={0,2}$/.test(v))
    throw new HttpError(401,'Autenticação obrigatória');
  return v.slice(7);
}
function hasMfa(claims) {
  const amr=Array.isArray(claims?.amr)?claims.amr:[];
  return amr.some(s=>['mfa','otp','webauthn','hwk'].includes(s));
}
function getTenant(req) {
  const tenantId=req.headers['x-sinea-tenant-id'];
  if(typeof tenantId!=='string' || !UUID.test(tenantId))
    throw new HttpError(400,'Identificador de instituição inválido');
  return tenantId;
}
function requireUuid(id) {
  if(!UUID.test(id))throw new HttpError(400,'Identificador inválido');
  return id;
}

/**
 * Repository must derive memberships from the DATABASE using verified subject.
 * This UI and route set MUST NOT accept role, permissions or student links from request bodies.
 * Production PostgreSQL currently denies all access by default.
 */
export function createHttpHandler({verify,repository,allowWrites=false}) {
  if(typeof verify!=='function' || !repository || typeof repository.withActor!=='function')
    throw new Error('Adaptadores seguros obrigatórios');
  return async function handler(req,res) {
    try {
      if(req.method==='GET' && req.url==='/healthz')
        return respond(res,200,{ok:true,component:'sinea-api',dataMode:'disabled-until-rls-approval'});
      if(!req.url?.startsWith('/v1/'))throw new HttpError(404,'Rota inexistente');
      const url=new URL(req.url,'http://localhost');
      if(url.search || url.hash)throw new HttpError(400,'Consulta não suportada');
      const match=/^\/v1\/students\/([0-9a-f-]+)\/(plans|daily-records|calm-sessions)$/.exec(url.pathname);
      if(!match)throw new HttpError(404,'Rota não habilitada');
      const [,rawId,resource]=match;
      const studentId=requireUuid(rawId);
      const tenantId=getTenant(req);
      const principal=await verify(requireBearer(req));
      if(!principal?.subject || typeof principal.subject!=='string')
        throw new HttpError(401,'Identidade não validada');
      // Stronger than minimum: all accesses to personal student records require MFA.
      if(!hasMfa(principal))throw new HttpError(403,'Segundo fator necessário');

      const result=await repository.withActor({subject:principal.subject,tenantId},
        async tx=>{
          const actor=await tx.getActor();
          if(!actor)throw new HttpError(403,'Vínculo institucional não autorizado');
          const student=await tx.getStudent(studentId);
          if(!student)throw new HttpError(404,'Estudante não encontrado');
          const action=resource==='plans'?OPERATIONS.PLAN_READ:
            resource==='daily-records'?OPERATIONS.RECORD_CREATE:OPERATIONS.CALM_CREATE;
          if(!authorizeSinea({actor,tenantId,student,action}))
            throw new HttpError(403,'Acesso não autorizado');
          if(req.method==='GET' && resource==='plans') {
            const plans=await tx.listPlans(studentId);
            return {status:200,body:{plans}};
          }
          if(req.method!=='POST' || resource==='plans')
            throw new HttpError(405,'Método não permitido');
          if(!allowWrites)throw new HttpError(503,'Gravação indisponível até a homologação de segurança');
          const body=await parseJson(req);
          const mutationId=requireUuid(req.headers['idempotency-key']);
          if(resource==='daily-records') {
            const input={...body,studentId};
            const validation=validateDailyEntry(input);
            if(!validation.valid)throw new HttpError(422,validation.error);
            if(!['aee','regente','mediador','apoio'].includes(body.modality.toLowerCase().split(' ')[0])
              && !['AEE individual','Mediação em sala','Atendimento em grupo'].includes(body.modality))
              throw new HttpError(422,'Modalidade não reconhecida');
            return {status:201,body:await tx.insertDailyRecord({studentId,mutationId,
              body,subject:principal.subject})};
          }
          const session={...body,studentId,professionalId:principal.subject};
          const validation=validateCalmSession(session);
          if(!validation.valid)throw new HttpError(422,'Dados do Canto da Calma inválidos');
          return {status:201,body:await tx.insertCalmSession({studentId,mutationId,
            session,subject:principal.subject})};
        });
      return respond(res,result.status,result.body);
    }catch(error) {
      // Never log request bodies, tokens, student identifiers or exception traces.
      const code=error instanceof HttpError?error.status:503;
      return respond(res,code,{error:code===503?'Serviço indisponível':error.message});
    }
  };
}
export function createHttpServer(adapters) {
  return createServer(createHttpHandler(adapters));
}
