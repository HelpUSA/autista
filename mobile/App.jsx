import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView, ScrollView, StyleSheet, StatusBar } from 'react-native';

const C={navy:'#10304b',teal:'#0f766e',light:'#f2f6f8',text:'#1e293b',muted:'#475569',white:'#fff'};
const demo=[
  {time:'08:00',icon:'👋',name:'Acolhimento',note:'Sala de aula'},
  {time:'08:30',icon:'📖',name:'Leitura com apoio visual',note:'Sala de aula'},
  {time:'09:15',icon:'🎒',name:'AEE individual',note:'Sala de recursos'},
  {time:'10:00',icon:'🍎',name:'Lanche',note:'Refeitório'},
  {time:'10:30',icon:'🧩',name:'Matemática adaptada',note:'Sala de aula'}
];
const aac=[
  {id:'agua',icon:'💧',name:'Quero água'},
  {id:'ajuda',icon:'🙋',name:'Preciso de ajuda'},
  {id:'pausa',icon:'🌿',name:'Preciso de pausa'},
  {id:'lanche',icon:'🍎',name:'Quero lanchar'}
];
const menu=[['home','Início'],['student','Estudante'],['calm','Calma'],['activities','Atividades'],['panel','Painel']];
function Button({children,onPress,active=false}) {return <Pressable accessibilityRole="button" onPress={onPress}
  style={[styles.button,active?styles.active:null]}><Text style={[styles.buttonText,active?{color:C.white}:null]}>{children}</Text></Pressable>;}
function Card({children}) {return <View style={styles.card}>{children}</View>;}
function Title({children}) {return <Text style={styles.title}>{children}</Text>;}
function Note({children}) {return <Text style={styles.note}>{children}</Text>;}
export default function App() {
  const [screen,setScreen]=useState('home'),[finished,setFinished]=useState([]),[question,setQuestion]=useState(0),[answer,setAnswer]=useState(''),[calmStarted,setCalmStarted]=useState(false);
  const q=[
    {prompt:'Qual é a cor azul?',answers:['🔵 Azul','🔴 Vermelho','🟢 Verde'],correct:'🔵 Azul'},
    {prompt:'Qual figura é um círculo?',answers:['🔺 Triângulo','⚪ Círculo','🟦 Quadrado'],correct:'⚪ Círculo'}
  ];
  return <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={C.navy}/>
    <View style={styles.header}><Text style={styles.logo}>SINEA</Text><Text style={styles.subtitle}>Cada aluno, uma história. Cada evolução, um dado que transforma.</Text></View>
    <View style={styles.warning}><Text style={styles.warningText}>DEMONSTRAÇÃO COM DADOS FICTÍCIOS · Sem CPF, laudos, login ou sincronização real.</Text></View>
    <ScrollView style={{flex:1}} contentContainerStyle={styles.content}>
      {screen==='home'&&<>
        <Title>Bom dia, Profª Marina!</Title><Note>EM Monteiro Lobato · Atendimento Educacional Especializado</Note>
        <Card><Text style={styles.cardTitle}>Agenda de hoje</Text>{demo.map((r,i)=><View key={i} style={styles.listRow}><Text style={styles.time}>{r.time}</Text><Text style={styles.rowTitle}>{r.icon} {r.name}</Text></View>)}</Card>
        <Card><Text style={styles.cardTitle}>Pendências</Text><Note>2 planos para revisão · 1 documento demonstrativo pendente</Note></Card>
      </>}
      {screen==='student'&&<>
        <Title>Minha rotina visual</Title><Note>Selecione uma etapa para marcar como concluída. As marcações são temporárias.</Note>
        {demo.map((r,i)=><Pressable key={i} accessibilityRole="button" accessibilityState={{selected:finished.includes(i)}} onPress={()=>setFinished(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])} style={styles.card}><View style={styles.listRow}><Text style={{fontSize:30}}>{r.icon}</Text><View style={{flex:1}}><Text style={styles.rowTitle}>{r.time} · {r.name}</Text><Note>{r.note}</Note></View><Text style={styles.time}>{finished.includes(i)?'✓':'○'}</Text></View></Pressable>)}
        <Card><Text style={styles.cardTitle}>Comunicação alternativa</Text><View style={styles.tileGrid}>{aac.map(x=><Pressable key={x.id} style={styles.tile} onPress={()=>setAnswer(x.name)}><Text style={{fontSize:26}}>{x.icon}</Text><Text style={styles.tileText}>{x.name}</Text></Pressable>)}</View>{answer!==''&&<Note>Cartão selecionado: {answer}</Note>}</Card>
      </>}
      {screen==='calm'&&<>
        <Title>Canto da Calma</Title><Note>Espaço de acolhimento, nunca de punição ou isolamento.</Note>
        <Card><Text style={styles.cardTitle}>Sessão demonstrativa</Text><Note>Temporizador e histórico real exigem autenticação e armazenamento seguro.</Note><Button onPress={()=>setCalmStarted(v=>!v)} active>{calmStarted?'Encerrar prévia':'Iniciar prévia'}</Button><Note>{calmStarted?'Prévia iniciada. Nenhum dado registrado.':'Pronto para explorar o fluxo.'}</Note></Card>
        <Card><Text style={styles.cardTitle}>Kit do Canto da Calma</Text><Note>Fone abafador · bolas sensoriais · ampulheta · cartões · almofada · tapete</Note></Card>
      </>}
      {screen==='activities'&&<>
        <Title>Atividades interativas</Title><Note>Sem notas e sem cronômetro; solicite ajuda quando quiser.</Note>
        <Card><Text style={styles.cardTitle}>{q[question].prompt}</Text>{q[question].answers.map(opt=><Button key={opt} onPress={()=>setAnswer(opt)}>{opt}</Button>)}<Note>{answer===''?'Escolha uma resposta.':answer===q[question].correct?'Você encontrou a opção!':'Podemos tentar outra vez.'}</Note>{answer===q[question].correct&&<Button active onPress={()=>{setQuestion(i=>(i+1)%q.length);setAnswer('');}}>Próxima atividade</Button>}</Card>
      </>}
      {screen==='panel'&&<>
        <Title>Painel da Rede</Title><Note>Indicadores exclusivamente fictícios e agregados.</Note>
        <Card><Text style={styles.cardTitle}>Unidades acompanhadas: 24</Text><Text style={styles.cardTitle}>Planos ativos: 1.280</Text><Text style={styles.cardTitle}>Cobertura AEE: 92%</Text></Card>
      </>}
    </ScrollView>
    <View style={styles.nav}>{menu.map(([id,title])=><Pressable key={id} accessibilityRole="tab" accessibilityState={{selected:screen===id}} onPress={()=>{setScreen(id);setAnswer('');}} style={styles.navTab}><Text style={{color:screen===id?C.teal:C.muted,fontSize:10,fontWeight:'700',textAlign:'center'}}>{title}</Text></Pressable>)}</View>
  </SafeAreaView>;
}
const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:C.light},
  header:{backgroundColor:C.navy,paddingHorizontal:20,paddingVertical:18},
  logo:{fontSize:28,fontWeight:'900',color:C.white,letterSpacing:1},
  subtitle:{fontSize:11,color:'#dbeafe',marginTop:3},
  warning:{padding:10,backgroundColor:'#fef3c7'},
  warningText:{color:'#78350f',fontSize:11,textAlign:'center',fontWeight:'600'},
  content:{padding:16,paddingBottom:30,gap:14},
  title:{fontSize:24,fontWeight:'900',color:C.navy,marginBottom:4},
  note:{color:C.muted,fontSize:13,lineHeight:19,marginTop:4},
  card:{backgroundColor:C.white,borderRadius:16,padding:16,borderColor:'#e2e8f0',borderWidth:1,marginBottom:12},
  cardTitle:{color:C.navy,fontWeight:'800',fontSize:16,marginBottom:10},
  listRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:9,borderBottomColor:'#e2e8f0',borderBottomWidth:1},
  time:{fontWeight:'800',fontSize:13,color:C.teal},
  rowTitle:{flex:1,fontSize:14,color:C.text,fontWeight:'600'},
  button:{padding:13,borderRadius:12,borderWidth:1,borderColor:'#99f6e4',marginVertical:4,backgroundColor:'#f0fdfa'},
  active:{backgroundColor:C.teal,borderColor:C.teal},
  buttonText:{fontWeight:'700',color:C.navy,textAlign:'center',fontSize:14},
  nav:{flexDirection:'row',backgroundColor:C.white,borderTopWidth:1,borderTopColor:'#e2e8f0',paddingVertical:14},
  navTab:{flex:1,padding:6,minHeight:40,justifyContent:'center'},
  tileGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  tile:{width:'47%',backgroundColor:'#f0fdfa',padding:12,borderRadius:12,alignItems:'center',minHeight:84},
  tileText:{color:C.navy,fontWeight:'700',fontSize:12,marginTop:7,textAlign:'center'}
});
