import test from 'node:test';
import assert from 'node:assert/strict';
import { activities, evaluateAnswer, getActivity, validateCatalog } from './engine.js';

test('catálogo válido com quatro atividades e 12 desafios', () => {
  assert.equal(validateCatalog(), true);
  assert.equal(activities.length, 4);
  assert.equal(activities.reduce((total, a) => total + a.questions.length, 0), 12);
});
test('resposta correta e tentativa alternativa produzem feedback consistente', () => {
  const first = getActivity('cores').questions[0];
  assert.equal(evaluateAnswer('cores', first.id, first.answer).correct, true);
  const alternative = first.options.find((o) => o.id !== first.answer);
  assert.equal(evaluateAnswer('cores', first.id, alternative.id).correct, false);
});
test('recusa atividade, questão ou alternativa inexistentes', () => {
  assert.equal(getActivity('desconhecida'), null);
  assert.throws(() => evaluateAnswer('cores', 'inexistente', 'a'));
  assert.throws(() => evaluateAnswer('cores', 'c1', 'inexistente'));
});
test('cada questão apresenta uma resposta válida', () => {
  activities.forEach((activity) => activity.questions.forEach((question) => {
    assert.equal(evaluateAnswer(activity.id, question.id, question.answer).correct, true);
  }));
});
