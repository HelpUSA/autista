import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectFireApkManifest,DENIED_FIRE_PERMISSIONS} from './apkManifestGate.mjs';
const pkg='com.helpus.sinea.activities.preview';
const base={
 expectedPackage:pkg,
 badging:`package: name='${pkg}' versionCode='1' versionName='0.1.0'\nsdkVersion:'24'\ntargetSdkVersion:'35'\napplication-label:'SINEA Activities'\n`,
 permissions:`package: ${pkg}\n`,
 xmltree:'N: android=http://schemas.android.com/apk/res/android\nE: manifest (line=1)\n  E: application (line=9)\n'
};
function check(change={}){return inspectFireApkManifest({...base,...change});}
test('aapt triplet must include package, sdk and manifest; no inferred success',()=>{
 const x=check();assert.equal(x.accepted,true);assert.equal(x.packageId,pkg);assert.equal(x.versionCode,1);
 for(const key of ['badging','permissions','xmltree']){
  const v=check({[key]:''});assert.equal(v.accepted,false,key);
 }
 assert.equal(check({badging:"package: name='a' versionCode='1'"}).accepted,false);
 assert.equal(check({xmltree:'not a manifest'}).accepted,false);
});
test('explicitly disallow internet, camera, audio and other children data permissions',()=>{
 for(const perm of DENIED_FIRE_PERMISSIONS){
  const p=check({permissions:base.permissions+`uses-permission: name='${perm}'\n`});
  assert.equal(p.accepted,false,perm);
  assert.ok(p.errors.some(x=>x.includes(perm)),perm);
 }
});
test('fail closed for mismatched package or SDK levels',()=>{
 assert.equal(check({permissions:"package: com.other.app\n"}).accepted,false);
 assert.equal(check({badging:base.badging.replace("name='"+pkg+"'","name='com.other.app'")}).accepted,false);
 assert.equal(check({badging:base.badging.replace("targetSdkVersion:'35'","targetSdkVersion:'22'")}).accepted,false);
 assert.equal(check({badging:base.badging.replace("versionCode='1'","versionCode='0'")}).accepted,false);
});
test('reject debuggable/test-only and cleartext traffic in binary evidence',()=>{
 assert.equal(check({badging:base.badging+"application-debuggable\n"}).accepted,false);
 assert.equal(check({badging:base.badging+"application-testOnly\n"}).accepted,false);
 assert.equal(check({xmltree:base.xmltree+" A: android:debuggable(0x0101000f)=(type 0x12)0xffffffff\n"}).accepted,false);
 assert.equal(check({xmltree:base.xmltree+" A: android:usesCleartextTraffic(0x010104ec)=(type 0x12)0x1\n"}).accepted,false);
});
test('preview identifiers cannot be accepted as commercial release',()=>{
 const r=check({release:true});assert.equal(r.accepted,false);
 assert.ok(r.errors.some(x=>x.includes('Preview')));
});
test('unknown permission causes explicit manual-review warning, not false claim',()=>{
 const r=check({permissions:base.permissions+"uses-permission: name='android.permission.VIBRATE'\n"});
 assert.equal(r.accepted,true);assert.equal(r.warnings.length,1);
});
