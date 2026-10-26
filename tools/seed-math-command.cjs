// Explicit first-publication helper. It never updates an existing remote record.
const path=require('node:path');
const serverRequire=require('node:module').createRequire(path.resolve(__dirname,'../server/package.json'));
serverRequire('dotenv').config({path:[path.resolve(__dirname,'../server/.env'),path.resolve(__dirname,'../.env')],quiet:true});
serverRequire('ts-node').register({transpileOnly:true,project:path.resolve(__dirname,'../server/tsconfig.json'),compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'}});
const {seedMathCommandMetadata}=require('../server/src/lib/mathCommandPersistence.ts');
const apply=process.argv.includes('--apply');
seedMathCommandMetadata(path.resolve(__dirname,'..'),apply).then(result=>{
  console.log(JSON.stringify({mode:apply?'initial-seed':'read-only-preview',...result},null,2));
  console.log(result.created?'Initial metadata saved to durable storage.':result.exists?'Existing durable metadata preserved. No overwrite performed.':'No durable metadata exists. Review this preview, then run with --apply to publish the initial local metadata.');
}).catch(error=>{console.error(error.message);process.exitCode=1;});
