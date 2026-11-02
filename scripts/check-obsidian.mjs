import {readdirSync,readFileSync} from 'node:fs';
import {resolve,join,relative,dirname} from 'node:path';
const root=resolve('docs');
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.isFile()&&e.name.endsWith('.md')?[join(dir,e.name)]:[]);}
const all=walk(root);
const known=new Set(all.map(path=>relative(root,path).replaceAll('\\','/')));
const errors=[];
const authored=all.filter(path=>relative(root,path).includes('/')||path.endsWith('00-Inicio.md'));
for(const path of authored){
 const content=readFileSync(path,'utf8');
 const label=relative(root,path).replaceAll('\\','/');
 if(!content.startsWith('---\n')||!content.includes('project: SINEA'))errors.push(label+' lacks YAML SINEA frontmatter');
 for(const [,raw] of content.matchAll(/\[\[([^\]]+)\]\]/g)){
  const target=raw.split('|')[0].split('#')[0].trim();
  const name=target.endsWith('.md')?target:target+'.md';
  const local=join(dirname(path),name);
  const relativeLocal=relative(root,local).replaceAll('\\','/');
  if(!known.has(name)&&!known.has(relativeLocal)&&!all.some(p=>p.endsWith('/'+name)))
    errors.push(label+' broken wikilink: '+target);
 }
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log('Obsidian vault: '+authored.length+' frontmatter documents, all wikilinks resolvable.');
