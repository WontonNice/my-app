// In-memory baseline: exclude only this batch's two registry additions.
// Preserve every pre-existing user change in the working tree.
const Module=require('node:module'),original=Module.prototype._compile;
Module.prototype._compile=function(source,filename){
  if(/[\\/]shared[\\/](infinitePractice|practiceOrganization)\.ts$/.test(filename)){
    source=source.replace(/^import \{ probabilityBatchPractice \} from '.\/probabilityBatchPractice';\r?\n/m,'');
    source=source.replace(/^  \.\.\.probabilityBatchPractice\.map\(template=>\(\{\.\.\.template,foundation:template\.destination\.groupType==='foundation',generate:\(index:number,seed:string\)=>template\.generate\(index,seed\)\.question\}\)\),\r?\n/m,'');
    source=source.replace('const definitions = [...probabilityBatchPractice, ','const definitions = [');
  }
  return original.call(this,source,filename);
};
