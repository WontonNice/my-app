// Read-only baseline: remove only this task's changes in memory, retaining pre-existing work.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=fs.readFileSync;
const sources=new Map();
for(const file of ['server/src/shared/infinitePractice.ts','server/src/shared/practiceOrganization.ts','tools/register-practice-generator.cjs','tools/inequality-practice.test.cjs'])sources.set(path.resolve(root,file),cp.execFileSync('git',['show','HEAD:'+file],{cwd:root,encoding:'utf8',windowsHide:true}));
const catalogPath=path.resolve(root,'server/src/shared/practiceCatalog.ts');
sources.set(catalogPath,read(catalogPath,'utf8').replace('enabled:generator.enabled??true,kind:', 'enabled:true,kind:'));
fs.readFileSync=function(file,options){const source=typeof file==='string'?sources.get(path.resolve(file)):undefined;if(source!==undefined)return (typeof options==='string'?options:options?.encoding)?source:Buffer.from(source);return read.apply(this,arguments);};
