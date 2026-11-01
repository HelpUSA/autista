/**
 * Conteúdo editorial EXCLUSIVAMENTE demonstrativo.
 * Não equivale a um instrumento de diagnóstico, avaliação clínica ou aferição automática do PEI.
 * Atribuições BNCC devem ser revisadas por equipe pedagógica antes de publicação.
 */
export const activities = [
  {
    id: 'cores', title: 'Descobrir cores', icon: '🎨',
    description: 'Observe as cores e escolha uma resposta.',
    area: 'Percepção visual e linguagem',
    questions: [
      { id: 'c1', prompt: 'Qual opção representa a cor azul?', options: [
        {id:'a',label:'Azul',symbol:'🔵'}, {id:'b',label:'Vermelho',symbol:'🔴'}, {id:'c',label:'Amarelo',symbol:'🟡'}
      ], answer:'a', hint:'Procure o círculo azul.' },
      { id: 'c2', prompt: 'Qual opção representa a cor verde?', options: [
        {id:'a',label:'Amarelo',symbol:'🟡'}, {id:'b',label:'Verde',symbol:'🟢'}, {id:'c',label:'Roxo',symbol:'🟣'}
      ], answer:'b', hint:'Procure o círculo verde.' },
      { id: 'c3', prompt: 'Qual opção representa a cor vermelha?', options: [
        {id:'a',label:'Azul',symbol:'🔵'}, {id:'b',label:'Amarelo',symbol:'🟡'}, {id:'c',label:'Vermelho',symbol:'🔴'}
      ], answer:'c', hint:'Procure o círculo vermelho.' }
    ]
  },
  {
    id: 'formas', title: 'Conhecer formas', icon: '🔷',
    description: 'Reconheça figuras geométricas.',
    area: 'Matemática: formas',
    questions: [
      { id:'f1', prompt:'Qual figura é um círculo?', options:[
        {id:'a',label:'Triângulo',symbol:'🔺'}, {id:'b',label:'Círculo',symbol:'⚪'}, {id:'c',label:'Quadrado',symbol:'🟦'}
      ], answer:'b', hint:'O círculo é redondo, sem cantos.' },
      { id:'f2', prompt:'Qual figura tem três lados?', options:[
        {id:'a',label:'Triângulo',symbol:'🔺'}, {id:'b',label:'Círculo',symbol:'⚪'}, {id:'c',label:'Quadrado',symbol:'🟦'}
      ], answer:'a', hint:'Conte três lados na figura.' },
      { id:'f3', prompt:'Qual figura representa um quadrado?', options:[
        {id:'a',label:'Círculo',symbol:'⚪'}, {id:'b',label:'Triângulo',symbol:'🔺'}, {id:'c',label:'Quadrado',symbol:'🟦'}
      ], answer:'c', hint:'Procure a figura com quatro lados iguais.' }
    ]
  },
  {
    id: 'contagem', title: 'Contar objetos', icon: '🔢',
    description: 'Conte com calma e escolha a quantidade.',
    area: 'Matemática: contagem',
    questions: [
      { id:'n1', prompt:'Quantas maçãs aparecem? 🍎 🍎', options:[
        {id:'a',label:'Uma',symbol:'1'}, {id:'b',label:'Duas',symbol:'2'}, {id:'c',label:'Três',symbol:'3'}
      ], answer:'b', hint:'Conte uma maçã de cada vez.' },
      { id:'n2', prompt:'Quantas estrelas aparecem? ⭐ ⭐ ⭐', options:[
        {id:'a',label:'Três',symbol:'3'}, {id:'b',label:'Uma',symbol:'1'}, {id:'c',label:'Duas',symbol:'2'}
      ], answer:'a', hint:'Aponte e conte cada estrela.' },
      { id:'n3', prompt:'Quantas bolas aparecem? ⚽', options:[
        {id:'a',label:'Duas',symbol:'2'}, {id:'b',label:'Três',symbol:'3'}, {id:'c',label:'Uma',symbol:'1'}
      ], answer:'c', hint:'Olhe quantas bolas existem.' }
    ]
  },
  {
    id: 'comunicacao', title: 'Expressar necessidades', icon: '💬',
    description: 'Encontre símbolos que ajudam a comunicar escolhas e necessidades.',
    area: 'Comunicação e autonomia',
    questions: [
      { id:'p1', prompt:'Qual cartão pode ser usado para pedir água?', options:[
        {id:'a',label:'Quero água',symbol:'💧'}, {id:'b',label:'Quero descansar',symbol:'🛋️'}, {id:'c',label:'Quero brincar',symbol:'🧸'}
      ], answer:'a', hint:'Procure o cartão com a gota de água.' },
      { id:'p2', prompt:'Qual cartão pode ser usado para pedir ajuda?', options:[
        {id:'a',label:'Quero lanchar',symbol:'🥪'}, {id:'b',label:'Preciso de ajuda',symbol:'🙋'}, {id:'c',label:'Quero água',symbol:'💧'}
      ], answer:'b', hint:'Procure o cartão com a pessoa levantando a mão.' },
      { id:'p3', prompt:'Qual cartão pode ser usado para pedir uma pausa?', options:[
        {id:'a',label:'Quero brincar',symbol:'🧸'}, {id:'b',label:'Quero água',symbol:'💧'}, {id:'c',label:'Quero descansar',symbol:'🛋️'}
      ], answer:'c', hint:'Procure o cartão com o sofá.' }
    ]
  }
];

export function getActivity(id) {
  return activities.find((activity) => activity.id === id) ?? null;
}

export function evaluateAnswer(activityId, questionId, optionId) {
  const activity = getActivity(activityId);
  const question = activity?.questions.find((item) => item.id === questionId);
  if (!question || !question.options.some((option) => option.id === optionId)) {
    throw new Error('Atividade, questão ou opção inválida');
  }
  return { correct: question.answer === optionId, hint: question.hint };
}

export function validateCatalog(catalog = activities) {
  const activityIds = new Set();
  for (const activity of catalog) {
    if (activityIds.has(activity.id) || !activity.questions?.length) return false;
    activityIds.add(activity.id);
    const questionIds = new Set();
    for (const question of activity.questions) {
      if (questionIds.has(question.id) || !question.prompt ||
          question.options.length < 2 ||
          new Set(question.options.map((o) => o.id)).size !== question.options.length ||
          !question.options.some((o) => o.id === question.answer)) return false;
      questionIds.add(question.id);
    }
  }
  return true;
}
