// Focused, read-only inspection; uses the selected checkout's own data and runtime.
const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
async function main(){
 const args=process.argv.slice(2),rootAt=args.indexOf('--root');
 let root=rootAt>=0?args[rootAt+1]:process.cwd();
 if(rootAt>=0){if(!root)throw Error('--root needs a checkout path.');args.splice(rootAt,2);}
 root=path.resolve(root);
 while(!fs.existsSync(path.join(root,'server/src/shared/practiceCatalog.ts'))){const parent=path.dirname(root);if(parent===root)throw Error('Run in a Nathan Tutors checkout or pass --root <checkout>.');root=parent;}
 const active=args.includes('--active'),ids=args.filter(arg=>arg!=='--active');
 if(!ids.length||ids.some(id=>id.startsWith('--')))throw Error('Use [--root <checkout>] [--active] <question-id> ...');
 const serverRequire=createRequire(path.join(root,'server/package.json'));
 serverRequire('ts-node').register({transpileOnly:true,project:path.join(root,'server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
 if(active)serverRequire('dotenv').config({path:[path.join(root,'server/.env'),path.join(root,'.env')],quiet:true});
 const store=serverRequire(path.join(root,'server/src/lib/mathCommandCatalogStore.ts'));
 const inspect=()=>{
  const records=new Map(store.readMathCommandCatalog(root).map(record=>[record.id,record]));
  const missing=ids.filter(id=>!records.has(id));if(missing.length)throw Error('Source question IDs not found: '+missing.join(', '));
  return {taxonomy:store.readMathCommandTaxonomy(root).categories,questions:ids.map(id=>{const record=records.get(id);return{id,category:record.question.topic,subcategory:record.question.subtopic,question:record.question,sources:record.sources};})};
 };
 const result=active?await serverRequire(path.join(root,'server/src/lib/mathCommandPersistence.ts')).withMathCommandPersistence(root,inspect):inspect();
 console.log(JSON.stringify(result,null,2));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
