import test from 'node:test';import assert from 'node:assert/strict';
import {createEditorialMaterial,approveBnccMappings,mayUseMaterial,independentPlanningAccess} from './editorialCatalog.js';
const editor={role:'editor',subject:'e1'};
const reviewer={role:'pedagogical_reviewer',subject:'p1'};
const input={id:'book1',title:'Projeto de leitura',edition:'2026',stage:'fundamental_i',copyrightOwner:'Editora'};
test('material exige direitos e revisão editorial antes do licenciamento',()=>{
 const draft=createEditorialMaterial(input,editor);
 assert.equal(draft.status,'draft');
 assert.equal(mayUseMaterial(draft,{materialId:'book1',tenantId:'t1',status:'active'},{tenantId:'t1'}),false);
 const approved=approveBnccMappings(draft,[{code:'CODIGO_VALIDAR',curriculumEdition:'BNCC edição aprovada',justification:'Equipe confirmou alinhamento curricular'}],reviewer);
 assert.equal(mayUseMaterial(approved,{materialId:'book1',tenantId:'t1',status:'active'},{tenantId:'t1'}),true);
 assert.equal(mayUseMaterial(approved,{materialId:'book1',tenantId:'t1',status:'active'},{tenantId:'t2'}),false);
});
test('BNCC não é atribuída automaticamente e exige responsável humano',()=>{
 const draft=createEditorialMaterial(input,editor);
 assert.throws(()=>approveBnccMappings(draft,[{code:'EF01XX01'}],reviewer));
 assert.throws(()=>approveBnccMappings(draft,[],editor));
});
test('planejamento independente não contém dados estudantis',()=>{
 const license={mode:'planning_only',status:'active'};
 assert.equal(independentPlanningAccess({role:'consultor_evoluce',subject:'c1'},license),true);
 assert.equal(independentPlanningAccess({role:'consultor_evoluce',subject:'c1',students:[]},license),false);
});
