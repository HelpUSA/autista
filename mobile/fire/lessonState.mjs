/** Pure lesson state. No persistence, scoring, timing, analytics or student IDs. */
const TOPICS=new Set(['colors','shapes','counting','communication','sequence']);
export function createFireLesson(topic='colors'){
 if(!TOPICS.has(topic))throw new Error('Unknown lesson topic');
 return Object.freeze({topic,index:0,choiceId:null,status:'active',paused:false});
}
export function advanceFireLesson(session,action,topicTasks){
 if(!session||typeof session!=='object'||!action||typeof action!=='object')return session;
 if(!TOPICS.has(session.topic)||!Array.isArray(topicTasks)||topicTasks.length===0||
    topicTasks.some(task=>task.topic!==session.topic))return session;
 const task=topicTasks[session.index];if(!task)return session;
 switch(action.type){
  case 'RESTART':return createFireLesson(session.topic);
  case 'TOGGLE_PAUSE':
   if(session.status==='finished')return session;
   return Object.freeze({...session,paused:!session.paused});
  case 'CHOOSE':
   if(session.paused||session.status!=='active'||typeof action.id!=='string'||
      !task.options.some(opt=>opt.id===action.id))return session;
   return Object.freeze({...session,choiceId:action.id,
      status:action.id===task.answer?'correct':'active'});
  case 'NEXT':
   if(session.paused||session.status!=='correct')return session;
   return session.index+1>=topicTasks.length?
      Object.freeze({...session,status:'finished',choiceId:null}):
      Object.freeze({...session,index:session.index+1,choiceId:null,status:'active'});
  default:return session;
 }
}
