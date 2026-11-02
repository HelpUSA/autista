import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';import {dirname,resolve} from 'node:path';
const here=dirname(fileURLToPath(import.meta.url));
test('mobile e web compartilham exatamente o mesmo catálogo PT EN ES',()=>{
 const base=readFileSync(resolve(here,'../../src/sinea/i18n.js'),'utf8');
 const native=readFileSync(resolve(here,'i18n.js'),'utf8');
 assert.equal(base,native);
});
