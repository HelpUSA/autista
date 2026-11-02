/**
 * Static, deliberately conservative checks of Android APK manifest evidence.
 * This checks only aapt output; it is NOT a proof of zero network traffic,
 * SDK privacy, COPPA compliance, Amazon acceptance, or signed-build quality.
 */
export const DENIED_FIRE_PERMISSIONS=Object.freeze([
 'android.permission.INTERNET',
 'android.permission.ACCESS_NETWORK_STATE',
 'android.permission.ACCESS_WIFI_STATE',
 'android.permission.ACCESS_FINE_LOCATION',
 'android.permission.ACCESS_COARSE_LOCATION',
 'android.permission.ACCESS_BACKGROUND_LOCATION',
 'android.permission.CAMERA',
 'android.permission.RECORD_AUDIO',
 'android.permission.READ_CONTACTS',
 'android.permission.WRITE_CONTACTS',
 'android.permission.GET_ACCOUNTS',
 'android.permission.READ_PHONE_STATE',
 'android.permission.READ_PHONE_NUMBERS',
 'android.permission.READ_SMS',
 'android.permission.RECEIVE_SMS',
 'android.permission.READ_CALENDAR',
 'android.permission.WRITE_CALENDAR',
 'android.permission.READ_EXTERNAL_STORAGE',
 'android.permission.WRITE_EXTERNAL_STORAGE',
 'android.permission.READ_MEDIA_IMAGES',
 'android.permission.READ_MEDIA_VIDEO',
 'android.permission.READ_MEDIA_AUDIO',
 'android.permission.POST_NOTIFICATIONS',
 'android.permission.QUERY_ALL_PACKAGES',
 'android.permission.BLUETOOTH_CONNECT',
 'android.permission.BLUETOOTH_SCAN',
 'android.permission.BODY_SENSORS',
 'com.android.vending.BILLING'
]);
function requiredText(value,label,errors){
 if(typeof value!=='string'||!value.trim()){errors.push(label+' missing or empty');return false;}
 return true;
}
function isBooleanTrueAttribute(xmltree,attribute){
 // aapt dump xmltree renders compiled bool true as 0xffffffff (or 0x1).
 // A bare occurrence without an explicit true value must not be approved.
 const lines=xmltree.split(/\r?\n/).filter(line=>line.includes('android:'+attribute+'('));
 return lines.some(line=>/\(type 0x12\)0x(?:ffffffff|0*1)\b/i.test(line)||
   /="true"/i.test(line));
}
export function inspectFireApkManifest({badging,permissions,xmltree,expectedPackage,release=false}={}){
 const errors=[],warnings=[];
 const hasBadging=requiredText(badging,'aapt badging',errors);
 const hasPermissions=requiredText(permissions,'aapt permissions',errors);
 const hasXmltree=requiredText(xmltree,'aapt xmltree',errors);
 if(typeof expectedPackage!=='string'||!/^com\.helpus\.sinea\.[a-z0-9.]+$/.test(expectedPackage))
   errors.push('Verified expected package must be configured explicitly');
 let packageId=null,versionCode=null,minSdk=null,targetSdk=null,perms=[];
 if(hasBadging){
  const pkg=badging.match(/^package:\s+name='([^']+)'\s+versionCode='([0-9]+)'/m);
  if(!pkg)errors.push('Badging has no verifiable package name and versionCode');
  else {packageId=pkg[1];versionCode=Number(pkg[2]);
   if(packageId!==expectedPackage)errors.push('Badging package does not match expected package');
   if(!Number.isSafeInteger(versionCode)||versionCode<1)errors.push('Invalid versionCode');
  }
  const min=badging.match(/^sdkVersion:'([0-9]+)'/m);
  const target=badging.match(/^targetSdkVersion:'([0-9]+)'/m);
  minSdk=min?Number(min[1]):null;targetSdk=target?Number(target[1]):null;
  if(!Number.isInteger(minSdk)||!Number.isInteger(targetSdk))errors.push('SDK levels absent from badging');
  else if(targetSdk<minSdk)errors.push('targetSdkVersion is below minSdkVersion');
  if(/^application-debuggable\b/m.test(badging))errors.push('APK is debuggable');
  if(/^application-testOnly\b/m.test(badging))errors.push('APK is testOnly');
 }
 if(hasPermissions){
  const id=permissions.match(/^package:\s+(?:name=)?'?([a-zA-Z][a-zA-Z0-9_.]+)'?\s*$/m);
  if(!id)errors.push('Permissions output lacks package identity');
  else if(id[1]!==expectedPackage)errors.push('Permissions package does not match expected package');
  perms=[...permissions.matchAll(/^uses-permission(?:-not-required)?:\s+name='([^']+)'/gm)].map(m=>m[1]);
  for(const permission of perms){
   if(DENIED_FIRE_PERMISSIONS.includes(permission))errors.push('Forbidden permission: '+permission);
   else warnings.push('Unreviewed permission: '+permission);
  }
 }
 if(hasXmltree){
  if(!xmltree.includes('E: manifest'))errors.push('Not an Android manifest XML tree');
  if(isBooleanTrueAttribute(xmltree,'debuggable'))errors.push('Manifest enables debuggable');
  if(isBooleanTrueAttribute(xmltree,'testOnly'))errors.push('Manifest enables testOnly');
  if(isBooleanTrueAttribute(xmltree,'usesCleartextTraffic'))errors.push('Manifest enables cleartext traffic');
 }
 if(release && packageId?.endsWith('.preview'))errors.push('Preview identifier forbidden for release');
 if(!release && packageId && !packageId.endsWith('.preview'))
   warnings.push('Internal test uses a non-preview package; verify intended distribution');
 return Object.freeze({
  accepted:errors.length===0,packageId,versionCode,minSdk,targetSdk,
  observedPermissions:Object.freeze(perms),errors:Object.freeze(errors),
  warnings:Object.freeze(warnings)
 });
}
