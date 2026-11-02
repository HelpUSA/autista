#!/usr/bin/env node
/**
 * Offline APK audit helper. Run from mobile/fire after using Android SDK aapt.
 * NEVER consider this output alone a COPPA/privacy/release authorization.
 */
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspectFireApkManifest} from '../apkManifestGate.mjs';
const args=process.argv.slice(2);
const arg=(name)=>{const i=args.indexOf(name);return i>=0?args[i+1]:undefined;};
const help=()=>{process.stderr.write(
'Usage: npm run inspect:apk -- --apk path.apk --badging path.txt --permissions path.txt --xmltree path.txt [--release]\n'+
'Generate: aapt dump badging app.apk > badging.txt; aapt dump permissions app.apk > permissions.txt; aapt dump xmltree app.apk AndroidManifest.xml > xmltree.txt\n');};
if(args.includes('--help')){help();process.exit(0);}
const required=['--apk','--badging','--permissions','--xmltree'];
if(required.some(a=>!arg(a))){help();process.exit(2);}
function bytes(path){return readFileSync(resolve(path));}
try{
 const appConfig=JSON.parse(readFileSync(fileURLToPath(new URL('../app.json',import.meta.url)),'utf8'));
 const release=args.includes('--release');
 const evidence={badging:bytes(arg('--badging')).toString('utf8'),
  permissions:bytes(arg('--permissions')).toString('utf8'),
  xmltree:bytes(arg('--xmltree')).toString('utf8'),
  expectedPackage:appConfig.expo.android.package,release};
 const result=inspectFireApkManifest(evidence);
 const apkPath=resolve(arg('--apk')),stat=statSync(apkPath);
 if(!stat.isFile()||stat.size<1024)throw Error('APK absent or implausibly small');
 const apk=bytes(apkPath);
 // This is a digest for evidence correlation only, NOT a signature verification.
 const sha256=createHash('sha256').update(apk).digest('hex');
 const approvalFlags=appConfig.expo.extra||{};
 const manuallyBlocked=approvalFlags.storeSubmissionAuthorized!==true||approvalFlags.releaseApproved!==true;
 const report={...result,apkSha256:sha256,apkBytes:stat.size,
  releaseAuthorization:'NOT_GRANTED_BY_THIS_SCRIPT',
  storeSubmissionAuthorized:!manuallyBlocked && false};
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
 if(!result.accepted)process.exitCode=1;
 if(release){
  process.stderr.write('Release mode is an evidence check only; formal approval and store submission remain separate.\n');
  if(manuallyBlocked){process.stderr.write('FAIL: explicit release approval flags not granted.\n');process.exitCode=1;}
 }
}catch(error){process.stderr.write('FAIL CLOSED: '+String(error.message||error)+'\n');process.exitCode=1;}
