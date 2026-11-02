import React,{useMemo,useState} from 'react';
import {SafeAreaView,ScrollView,StatusBar,Text,View,Image,Pressable,StyleSheet} from 'react-native';
import {FIRE_LOCALES,FIRE_DEFAULT_LOCALE,fireText,fireTopics,fireRoutine,
  fireCommunicationCards,fireTasks} from './content.mjs';
import {createFireLesson,advanceFireLesson} from './lessonState.mjs';
const logo=require('./assets/helpus-logo.jpg');
const C={navy:'#10304b',teal:'#0f766e',light:'#e8f7f2',canvas:'#f3f7fa',white:'#ffffff',
  muted:'#475569',border:'#cbd5e1',amber:'#92400e'};
const T={
  header:{fontSize:25,fontWeight:'900',color:C.navy},
  sub:{fontSize:16,lineHeight:25,color:C.muted}
};
function Pill({label,onPress,selected=false,disabled=false,accessibilityLabel}){
 return <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button"
  accessibilityLabel={accessibilityLabel||label}
  accessibilityState={{selected,disabled}}
  style={[s.pill,selected&&s.pillActive,disabled&&s.disabled]}>
  <Text style={[s.pillText,selected&&s.pillTextActive]}>{label}</Text>
 </Pressable>;
}
function Panel({children}){return <View style={s.panel}>{children}</View>;}
export default function FireActivities(){
 const [locale,setLocale]=useState(FIRE_DEFAULT_LOCALE);
 const [page,setPage]=useState('home');
 const [lesson,setLesson]=useState(()=>createFireLesson('colors'));
 const [completedSteps,setCompletedSteps]=useState([]);
 const [selectedCard,setSelectedCard]=useState(null);
 const tr=key=>fireText(locale,key);
 const activities=useMemo(()=>fireTasks(locale),[locale]);
 const tasks=activities.filter(x=>x.topic===lesson.topic),current=tasks[lesson.index]??null;
 const currentCorrect=lesson.status==='correct';
 function lessonAction(action){setLesson(prev=>advanceFireLesson(prev,action,activities.filter(x=>x.topic===prev.topic)));}
 function openPage(next){setPage(next);}
 function beginTopic(next){setLesson(createFireLesson(next));setPage('lesson');}
 function restartTopic(){lessonAction({type:'RESTART'});}
 function back(){if(page==='lesson')openPage('explore');else openPage('home');}
 return <SafeAreaView style={s.screen}>
  <StatusBar barStyle="light-content" backgroundColor={C.navy}/>
  <View style={s.header}>
   <View style={s.brand}>
    <View style={s.logoBox}><Image source={logo} resizeMode="contain" style={s.logo} accessibilityLabel="HelpUS"/></View>
    <View style={{flex:1}}><Text style={s.brandTitle}>{tr('title')}</Text><Text style={s.brandSubtitle}>{tr('subtitle')}</Text></View>
   </View>
   <Text style={s.languageHeading}>{tr('languages')}</Text>
   <View style={s.languageRow}>{FIRE_LOCALES.map(l=><Pill key={l}
     label={{'en-US':'EN','pt-BR':'PT','es-ES':'ES'}[l]}
     accessibilityLabel={l} onPress={()=>setLocale(l)} selected={locale===l}/>)}</View>
  </View>
  <ScrollView style={{flex:1}} contentContainerStyle={s.scroll}>
   <View style={s.internal}><Text style={s.internalText}>{tr('demo')}</Text></View>
   {page!=='home'&&<Pill label={'← '+tr('back')} onPress={back}/>}
   {page==='home'&&<>
    <Text style={T.header}>{tr('welcome')}</Text>
    <Text style={T.sub}>{tr('intro')}</Text>
    <Panel><Text style={s.panelTitle}>🌱 {tr('explore')}</Text>
     <Text style={T.sub}>{tr('topicIntro')}</Text><Pill label={tr('start')} onPress={()=>openPage('explore')} selected/></Panel>
    <Panel><Text style={s.panelTitle}>🗓️ {tr('routine')}</Text>
     <Text style={T.sub}>{tr('routinesIntro')}</Text><Pill label={tr('routine')} onPress={()=>openPage('routine')}/></Panel>
    <Panel><Text style={s.panelTitle}>💬 {tr('cards')}</Text>
     <Text style={T.sub}>{tr('cardIntro')}</Text><Pill label={tr('start')} onPress={()=>openPage('cards')}/></Panel>
    <Text style={s.small}>✓ {tr('noTime')}   ·   ✓ {tr('noLogin')}</Text>
   </>}
   {page==='explore'&&<>
    <Text style={T.header}>{tr('chooseTopic')}</Text>
    <View style={s.grid}>{fireTopics().map(x=><Pressable key={x.id}
      style={s.topic} onPress={()=>beginTopic(x.id)} accessibilityRole="button">
      <Text style={s.bigIcon}>{x.emoji}</Text>
      <Text style={s.topicLabel}>{tr(x.title)}</Text></Pressable>)}</View>
   </>}
   {page==='lesson'&&lesson.status==='finished'&&<>
    <Text accessibilityRole="header" style={T.header}>{tr('finished')}</Text>
    <Panel><Text style={T.sub}>{tr('notSaved')}</Text>
     <Pill label={tr('again')} onPress={restartTopic} selected/>
     <Pill label={tr('chooseTopic')} onPress={()=>openPage('explore')}/>
    </Panel>
   </>}
   {page==='lesson'&&lesson.status!=='finished'&&current&&<>
    <Text style={s.eyebrow}>{tr('step')} {lesson.index+1} {tr('of')} {tasks.length}</Text>
    <Text style={T.header}>{tr(fireTopics().find(t=>t.id===lesson.topic).title)}</Text>
    {lesson.paused?<Panel><Text style={s.panelTitle}>{tr('pause')}</Text><Pill label={tr('resume')} selected onPress={()=>lessonAction({type:'TOGGLE_PAUSE'})}/></Panel>:
     <Panel>
       <Text accessibilityRole="header" style={s.prompt}>{current.prompt}</Text>
       <View style={s.grid}>{current.options.map(choice=><Pressable key={choice.id}
        accessibilityRole="button" accessibilityLabel={choice.text} accessibilityState={{selected:lesson.choiceId===choice.id,disabled:currentCorrect}}
        disabled={currentCorrect}
        onPress={()=>lessonAction({type:'CHOOSE',id:choice.id})}
        style={[s.option,lesson.choiceId===choice.id&&s.optionSelected]}>
        <Text style={s.bigIcon}>{choice.symbol}</Text><Text style={s.optionLabel}>{choice.text}</Text>
       </Pressable>)}</View>
       <Text accessibilityLiveRegion="polite" style={s.feedback}>
        {lesson.choiceId?currentCorrect?tr('correct'):tr('tryAgain'):tr('yourTurn')}
       </Text>
       {currentCorrect&&<Pill selected label={lesson.index+1===tasks.length?tr('completeLesson'):tr('next')}
         onPress={()=>lessonAction({type:'NEXT'})}/>}
     </Panel>}
    <View style={s.controls}><Pill label={lesson.paused?tr('resume'):tr('pause')} onPress={()=>lessonAction({type:'TOGGLE_PAUSE'})}/>
     <Pill label={tr('reset')} onPress={restartTopic}/></View>
    <Text style={s.small}>{tr('notSaved')}</Text>
   </>}
   {page==='routine'&&<>
    <Text style={T.header}>{tr('routinesHeading')}</Text><Text style={T.sub}>{tr('routinesIntro')}</Text>
    {fireRoutine(locale).map((item,index)=><Pressable key={item.id} onPress={()=>setCompletedSteps(prev=>
     prev.includes(index)?prev.filter(x=>x!==index):[...prev,index])}
     accessibilityRole="button" accessibilityState={{selected:completedSteps.includes(index)}}
     style={[s.routine,completedSteps.includes(index)&&s.routineDone]}>
     <Text style={s.bigIcon}>{item.emoji}</Text>
     <Text style={s.routineText}>{item.text}</Text><Text style={s.routineMark}>{completedSteps.includes(index)?'✓':'○'}</Text>
    </Pressable>)}
    <Pill label={tr('reset')} onPress={()=>setCompletedSteps([])}/>
    <Text style={s.small}>{tr('notSaved')}</Text>
   </>}
   {page==='cards'&&<>
    <Text style={T.header}>{tr('cardHeading')}</Text>
    <Text style={T.sub}>{tr('cardIntro')}</Text>
    <View style={s.grid}>{fireCommunicationCards(locale).map(card=><Pressable key={card.id}
      onPress={()=>setSelectedCard(card.id)} accessibilityRole="button"
      accessibilityState={{selected:card.id===selectedCard}}
      style={[s.option,selectedCard===card.id&&s.optionSelected]}>
      <Text style={s.bigIcon}>{card.symbol}</Text><Text style={s.optionLabel}>{card.text}</Text>
    </Pressable>)}</View>
    <Text accessibilityLiveRegion="polite" style={s.feedback}>{selectedCard?
     tr('selected')+': '+fireCommunicationCards(locale).find(x=>x.id===selectedCard).text:''}</Text>
    <Text style={s.small}>{tr('cardSupport')} {tr('notSaved')}</Text>
   </>}
   {page==='privacy'&&<>
    <Text style={T.header}>{tr('privacy')}</Text>
    <Panel><Text style={T.sub}>{tr('privacyBody')}</Text>
      <Text style={s.caution}>{tr('privacyWarning')}</Text></Panel>
   </>}
  </ScrollView>
  <View style={s.bottom}>
   {['home','explore','routine','cards','privacy'].map(key=><Pressable key={key}
    onPress={()=>openPage(key)} accessibilityRole="tab" accessibilityState={{selected:page===key}}
    style={[s.tab,page===key&&s.tabSelected]}>
     <Text style={[s.tabText,page===key&&s.tabTextSelected]}>{tr(key)}</Text>
    </Pressable>)}
  </View>
 </SafeAreaView>;
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:C.canvas},header:{backgroundColor:C.navy,padding:15},
 brand:{flexDirection:'row',alignItems:'center',gap:12},
 logoBox:{backgroundColor:C.white,borderRadius:10,padding:4},logo:{width:62,height:45},
 brandTitle:{fontSize:22,fontWeight:'900',color:C.white},brandSubtitle:{fontSize:12,color:'#ccfbf1'},
 languageHeading:{fontSize:12,color:'#e0f2f1',marginTop:10,marginBottom:3},
 languageRow:{flexDirection:'row',gap:9},
 pill:{paddingHorizontal:16,paddingVertical:11,minHeight:46,borderColor:'#9bd8d0',borderWidth:1,
  borderRadius:12,alignItems:'center',justifyContent:'center',marginVertical:4,alignSelf:'flex-start',backgroundColor:C.white},
 pillActive:{backgroundColor:C.teal,borderColor:C.teal},pillText:{color:C.navy,fontWeight:'800',fontSize:14},
 pillTextActive:{color:C.white},disabled:{opacity:.5},
 scroll:{padding:16,paddingBottom:40,gap:13},
 internal:{borderRadius:10,backgroundColor:'#fef3c7',padding:12},
 internalText:{color:C.amber,fontSize:12,fontWeight:'700'},
 panel:{borderRadius:18,borderWidth:1,borderColor:C.border,backgroundColor:C.white,padding:17,gap:9},
 panelTitle:{fontSize:19,color:C.navy,fontWeight:'800'},small:{fontSize:12,color:C.muted,lineHeight:20},
 caution:{fontSize:13,color:C.amber,fontWeight:'700',marginTop:10},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:10},
 topic:{width:'47%',minHeight:128,borderWidth:1,borderColor:C.border,borderRadius:18,backgroundColor:C.white,
   padding:15,justifyContent:'center',alignItems:'center'},
 topicLabel:{textAlign:'center',fontSize:16,fontWeight:'800',color:C.navy,marginTop:12},
 bigIcon:{fontSize:37,textAlign:'center'},
 eyebrow:{color:C.teal,fontSize:14,fontWeight:'700'},
 prompt:{fontSize:22,lineHeight:31,color:C.navy,fontWeight:'800'},
 option:{width:'47%',minHeight:140,borderWidth:2,borderColor:C.border,borderRadius:16,
   backgroundColor:C.white,alignItems:'center',justifyContent:'center',gap:13,padding:12},
 optionSelected:{borderColor:C.teal,backgroundColor:C.light},
 optionLabel:{fontSize:16,fontWeight:'700',color:C.navy,textAlign:'center'},
 feedback:{fontSize:16,fontWeight:'700',color:C.teal,marginTop:10},
 controls:{flexDirection:'row',gap:12,flexWrap:'wrap'},
 routine:{minHeight:78,flexDirection:'row',alignItems:'center',gap:14,padding:14,borderWidth:2,
   borderColor:C.border,borderRadius:16,backgroundColor:C.white},
 routineDone:{backgroundColor:C.light,borderColor:C.teal},
 routineText:{flex:1,fontWeight:'800',fontSize:17,color:C.navy},
 routineMark:{fontSize:22,color:C.teal},
 bottom:{flexDirection:'row',borderTopWidth:1,borderColor:C.border,backgroundColor:C.white,paddingBottom:5},
 tab:{flex:1,paddingVertical:12,paddingHorizontal:2,minHeight:56,justifyContent:'center',alignItems:'center'},
 tabSelected:{borderTopColor:C.teal,borderTopWidth:3},
 tabText:{textAlign:'center',fontSize:11,fontWeight:'700',color:C.muted},
 tabTextSelected:{color:C.teal}
});
