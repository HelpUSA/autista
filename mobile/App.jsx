import React,{useState} from 'react';
import {View,Text,Pressable,SafeAreaView,ScrollView,StyleSheet,StatusBar,Image} from 'react-native';
import {translate,LANGUAGES,DEFAULT_LANGUAGE} from './src/i18n.js';
const C={navy:'#10304b',teal:'#0f766e',bg:'#f3f7fa',white:'#fff',muted:'#475569',border:'#dbe5ea'};
const logo=require('./assets/helpus-logo.jpg');
const steps=[['👋','routineWelcome'],['📚','routineReading'],['🍎','routineSnack'],['🧩','routineMath'],['🌿','routineBreak']];
const cards=[['💧','water'],['🙋','help'],['🌿','rest']];
const nav=[['home','home'],['student','students'],['record','record'],['plans','plans'],['dashboard','dashboard']];
function Press({children,onPress,active=false,disabled=false}){return <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" style={[styles.button,active?styles.active:null,disabled?{opacity:.5}:null]}><Text style={[styles.buttonText,active?{color:C.white}:null]}>{children}</Text></Pressable>;}
function Card({children}){return <View style={styles.card}>{children}</View>;}
function Head({children}){return <Text style={styles.head}>{children}</Text>;}
export default function App(){
 const [locale,setLocale]=useState(DEFAULT_LANGUAGE);
 const t=k=>translate(locale,k);
 const [page,setPage]=useState('home');
 const [finished,setFinished]=useState([]);
 const [read,setRead]=useState(false);
 const [choice,setChoice]=useState(null);
 const [question,setQuestion]=useState('colors');
 const [calmItems,setCalmItems]=useState([]);
 const [secondary,setSecondary]=useState(false);
 const lessons={colors:{prompt:'colorsPrompt',options:[['🔵','blue'],['🔴','red'],['🟢','green']],correct:'blue'},shapes:{prompt:'shapesPrompt',options:[['🔺','triangle'],['⚪','circle'],['🟦','square']],correct:'circle'},counting:{prompt:'countPrompt',options:[['1','one'],['2','two'],['3','three']],correct:'three'},communication:{prompt:'communicationPrompt',options:cards,correct:'water'}};
 const active=lessons[question];
 const open=(key)=>{setPage(key);setChoice(null);setSecondary(false);};
 const secondaryNav=[['family','family'],['routine','routine'],['activities','activities'],['calm','calm'],['support','support']];
 return <SafeAreaView style={styles.screen}>
  <StatusBar barStyle="light-content" backgroundColor={C.navy}/>
  <View style={styles.header}><View style={styles.brand}><Image source={logo} style={{width:58,height:42,resizeMode:'contain',backgroundColor:C.white,borderRadius:6}} accessibilityLabel="HelpUS"/>
   <View style={{flex:1}}><Text style={styles.logo}>SINEA</Text><Text style={styles.subtitle}>{t('subtitle')}</Text></View></View>
   <View style={styles.languages}>{LANGUAGES.map(l=><Pressable key={l.id} accessibilityRole="button" accessibilityState={{selected:locale===l.id}} onPress={()=>setLocale(l.id)} style={[styles.lang,locale===l.id?styles.langActive:null]}><Text style={{color:C.white,fontWeight:'700',fontSize:12}}>{l.short}</Text></Pressable>)}</View>
  </View>
  <View style={styles.warning}><Text style={styles.warnText}>{t('demo')}</Text></View>
  <ScrollView style={{flex:1}} contentContainerStyle={styles.content}>
   {page==='home'&&<><Head>{t('greeting')}</Head><Text style={styles.note}>{t('demoInstitution')}</Text><Card><Text style={styles.cardTitle}>{t('today')}</Text>{steps.map(([icon,key],i)=><View key={key} style={styles.row}><Text style={styles.time}>{String(8+i).padStart(2,'0')}:00</Text><Text style={styles.rowLabel}>{icon} {t(key)}</Text></View>)}</Card><Card><Text style={styles.cardTitle}>{t('pending')}</Text><Text style={styles.note}>{t('countPlans')}: 2</Text></Card></>}
   {page==='student'&&<><Head>{t('routineTitle')}</Head><Text style={styles.note}>{t('routineDescription')}</Text>
    {steps.map(([icon,key],i)=><Pressable key={key} accessibilityRole="button" accessibilityState={{selected:finished.includes(i)}} onPress={()=>setFinished(arr=>arr.includes(i)?arr.filter(n=>n!==i):[...arr,i])} style={styles.card}><View style={styles.row}><Text style={{fontSize:28}}>{icon}</Text><Text style={styles.rowLabel}>{t(key)}</Text><Text style={styles.time}>{finished.includes(i)?'✓':'○'}</Text></View></Pressable>)}
    <Card><Text style={styles.cardTitle}>{t('communication')}</Text><View style={styles.tiles}>{cards.map(([emoji,key])=><Pressable key={key} onPress={()=>setChoice(key)} active={choice===key}>{emoji} {t(key)}</Press>)}</View></Card></>}
   {page==='record'&&<><Head>{t('dailyTitle')}</Head><Card><Text style={styles.cardTitle}>{t('professionalView')}</Text><Text style={styles.note}>{t('sampleActivity')}</Text><Text style={styles.note}>{t('participation')}: 4/5 · {t('usedSupports')}: {t('sampleSupport')}</Text><Text style={styles.warningText}>{t('demoLocked')}</Text></Card><Card><Text style={styles.cardTitle}>{t('familySummary')}</Text><Text style={styles.note}>{t('sampleSummary')}</Text></Card></>}
   {page==='plans'&&<><Head>{t('planTitle')}</Head>{['PEI','PDI','PAEE'].map(k=><Card key={k}><Text style={styles.cardTitle}>{k} · {t('statusReview')}</Text><Text style={styles.note}>{t('sampleGoalOne')}</Text><Text style={styles.note}>{t('humanReview')}</Text></Card>)}</>}
   {page==='dashboard'&&<><Head>{t('dashboardTitle')}</Head><Text style={styles.note}>{t('aggregates')}</Text>{[['schools','24'],['activePlans','1.280'],['coverage','92%']].map(([k,val])=><Card key={k}><Text style={styles.cardTitle}>{t(k)}: {val}</Text></Card>)}<Text style={styles.warningText}>{t('noIdentify')}</Text></>}
   {page==='family'&&<><Head>{t('familyTitle')}</Head><Card><Text style={styles.cardTitle}>{t('announcements')}</Text><Text style={styles.note}>{t('sampleAnnouncement')}</Text><Text style={styles.note}>{t('sampleAnnouncementBody')}</Text><Text style={styles.note}>{read?t('readConfirmed'):t('unread')}</Text><Press disabled={read} active onPress={()=>setRead(true)}>{t('markRead')}</Press></Card><Card><Text style={styles.cardTitle}>{t('channels')}</Text><Text style={styles.note}>{t('channelPedagogy')} · {t('channelAee')} · {t('channelAdmin')}</Text><Text style={styles.warningText}>{t('sendBlocked')}</Text></Card><Card><Text style={styles.cardTitle}>{t('calendar')}</Text><Text style={styles.note}>{t('sampleEvent')}</Text></Card><Card><Text style={styles.cardTitle}>{t('authorization')}</Text><Text style={styles.note}>{t('sampleAuthorization')} · {t('approvalPending')}</Text></Card></>}
   {page==='routine'&&<><Head>{t('routineTitle')}</Head>{steps.map(([emoji,key],i)=><Press key={key} onPress={()=>setFinished(a=>a.includes(i)?a.filter(n=>n!==i):[...a,i])}>{emoji} {t(key)} {finished.includes(i)?'✓':'○'}</Press>)}</>}
   {page==='activities'&&<><Head>{t('activitiesTitle')}</Head><Text style={styles.note}>{t('activityIntro')}</Text><View style={styles.tiles}>{Object.keys(lessons).map(k=><Press key={k} active={question===k} onPress={()=>{setQuestion(k);setChoice(null);}}>{t(k)}</Press>)}</View><Card><Text style={styles.cardTitle}>{t(active.prompt)}</Text>{active.options.map(([symbol,key])=><Press key={key} onPress={()=>setChoice(key)} active={choice===key}>{symbol} {t(key)}</Press>)}<Text style={styles.note}>{choice===null?'':choice===active.correct?t('correct'):t('tryAgain')}</Text></Card></>}
   {page==='calm'&&<><Head>{t('calmTitle')}</Head><Card><Text style={styles.note}>{t('calmEthics')}</Text><Text style={styles.cardTitle}>{t('sensoryItems')}</Text>{[['🎧','calmHeadset'],['💬','calmCards'],['🛋️','calmCushion'],['⌛','calmTimer']].map(([symbol,key])=><Press key={key} active={calmItems.includes(key)} onPress={()=>setCalmItems(old=>old.includes(key)?old.filter(n=>n!==key):[...old,key])}>{symbol} {t(key)}</Press>)}<Text style={styles.warningText}>{t('calmPreview')}</Text></Card></>}
   {page==='support'&&<><Head>{t('aiTitle')}</Head><Card><Text style={styles.cardTitle}>{t('adaptation')}</Text><Text style={styles.note}>{t('sampleSupport')}</Text><Text style={styles.warningText}>{t('aiWarning')}</Text></Card></>}
   <Text style={styles.foot}>{t('copyright')} · {t('privacy')}</Text>
  </ScrollView>
  <View style={styles.nav}>{nav.map(([key,label])=><Pressable key={key} accessibilityRole="tab" accessibilityState={{selected:page===key}} style={styles.navItem} onPress={()=>open(key)}><Text style={[styles.navText,page===key?{color:C.teal}:null]}>{t(label)}</Text></Pressable>)}</View>
  <Pressable style={styles.more} accessibilityRole="button" onPress={()=>setSecondary(v=>!v)}><Text style={styles.moreText}>{t('family')} · {t('activities')} · {t('calm')} {secondary?'−':'＋'}</Text></Pressable>
  {secondary&&<View style={styles.moreItems}>{secondaryNav.map(([key,label])=><Pressable key={key} accessibilityRole="button" style={styles.moreItem} onPress={()=>open(key)}><Text style={styles.moreText}>{t(label)}</Text></Pressable>)}</View>}
 </SafeAreaView>;
}
const styles=StyleSheet.create({
 screen:{flex:1,backgroundColor:C.bg},header:{backgroundColor:C.navy,padding:14},brand:{flexDirection:'row',alignItems:'center',gap:12},logo:{fontWeight:'900',fontSize:27,color:C.white},subtitle:{fontSize:11,color:'#d4f6f2'},languages:{flexDirection:'row',gap:8,marginTop:10},lang:{padding:7,borderRadius:8,borderWidth:1,borderColor:'#719ba4',minWidth:54,alignItems:'center'},langActive:{backgroundColor:C.teal,borderColor:'#5eead4'},warning:{padding:11,backgroundColor:'#fff4d6'},warnText:{fontSize:11,color:'#7c4100'},content:{padding:15,paddingBottom:25},head:{fontSize:22,fontWeight:'900',color:C.navy,marginTop:5,marginBottom:10},note:{fontSize:13,lineHeight:20,color:C.muted,marginBottom:8},card:{padding:15,backgroundColor:C.white,borderColor:C.border,borderWidth:1,borderRadius:14,marginBottom:12},cardTitle:{fontSize:16,fontWeight:'800',color:C.navy,marginBottom:9},row:{flexDirection:'row',alignItems:'center',gap:10,marginVertical:7},rowLabel:{flex:1,fontWeight:'600',color:C.navy,fontSize:14},time:{fontSize:13,fontWeight:'800',color:C.teal},button:{padding:12,borderColor:'#86c6bf',borderWidth:1,borderRadius:11,marginVertical:4,backgroundColor:'#f0fdfa',minHeight:45,justifyContent:'center'},active:{backgroundColor:C.teal},buttonText:{fontSize:13,textAlign:'center',fontWeight:'700',color:C.navy},tiles:{gap:5},warningText:{fontSize:12,color:'#854d0e',marginVertical:10},nav:{flexDirection:'row',backgroundColor:C.white,borderTopWidth:1,borderColor:C.border},navItem:{flex:1,paddingVertical:12,paddingHorizontal:2,alignItems:'center',justifyContent:'center',minHeight:50},navText:{fontSize:10,fontWeight:'700',color:C.muted,textAlign:'center'},more:{backgroundColor:C.white,alignItems:'center',padding:9,borderTopWidth:1,borderColor:C.border},moreText:{fontSize:12,fontWeight:'700',color:C.teal},moreItems:{backgroundColor:C.white,padding:6,flexDirection:'row',flexWrap:'wrap',gap:5},moreItem:{width:'48%',padding:9,alignItems:'center',backgroundColor:'#f0fdfa',borderRadius:9},foot:{textAlign:'center',fontSize:11,color:C.muted,marginTop:20}
});
