import { createRemoteJWKSet, jwtVerify } from 'jose';

export function createTokenVerifier({issuer,audience,jwksUrl}) {
  if(!issuer || !audience || !jwksUrl || !/^https:\/\//.test(jwksUrl))
    throw new Error('OIDC issuer, audience e JWKS HTTPS são obrigatórios');
  const jwks=createRemoteJWKSet(new URL(jwksUrl),{timeoutDuration:3000,cooldownDuration:30000});
  return async token=>{
    try {
      const {payload}=await jwtVerify(token,jwks,{
        issuer,audience,algorithms:['RS256','ES256'],clockTolerance:5,maxTokenAge:'20m'
      });
      if(typeof payload.sub!=='string' || !payload.sub || !payload.exp || !payload.iat)
        return null;
      return {subject:payload.sub,amr:Array.isArray(payload.amr)?payload.amr:[],
        issuer:payload.iss,audience:payload.aud};
    }catch {
      // Never reflect token or sensitive verification failure details.
      return null;
    }
  };
}
