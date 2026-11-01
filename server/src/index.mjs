import { createHttpServer } from './http.mjs';
import { createTokenVerifier } from './auth.mjs';
import { createPostgresRepository } from './postgres.mjs';

function configFromEnv(env) {
  if(env.SINEA_SERVER_ENABLED!=='true')
    throw new Error('SINEA_SERVER_ENABLED não habilitado: serviço protegido e fechado por padrão');
  for(const k of ['SINEA_OIDC_ISSUER','SINEA_OIDC_AUDIENCE',
    'SINEA_OIDC_JWKS_URL','SINEA_DATABASE_URL'])
    if(!env[k])throw new Error(k+' é obrigatório');
  if(env.NODE_ENV==='production' && !env.SINEA_DATABASE_CA)
    throw new Error('CA de banco obrigatório em produção');
  return {issuer:env.SINEA_OIDC_ISSUER,audience:env.SINEA_OIDC_AUDIENCE,
    jwksUrl:env.SINEA_OIDC_JWKS_URL,database:env.SINEA_DATABASE_URL,
    ca:env.SINEA_DATABASE_CA,host:env.SINEA_BIND_HOST??'127.0.0.1',
    port:Number(env.PORT??4000)};
}

const config=configFromEnv(process.env);
const verify=createTokenVerifier(config);
const repository=createPostgresRepository({connectionString:config.database,
  ssl:config.ca?{ca:config.ca,rejectUnauthorized:true}:{rejectUnauthorized:true}});
const server=createHttpServer({verify,repository,allowWrites:false});
server.on('error',()=>{process.exitCode=1;});
server.listen(config.port,config.host,()=>{
  console.log('SINEA protected API started; student writes DISABLED pending security gates');
});
for(const name of ['SIGINT','SIGTERM'])process.on(name,async()=>{
  server.close();
  await repository.close();
});
