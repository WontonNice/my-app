import {registerHooks,createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const require=createRequire(new URL('./test-deps/anchor.cjs',import.meta.url));
const parserUrl=pathToFileURL(require.resolve('cheerio')).href;
registerHooks({resolve(specifier,context,next){return specifier==='cheerio'?{url:parserUrl,shortCircuit:true}:next(specifier,context);}});
