import type { MathDuplicateGroup, MathQuestionRecord } from './mathCommandTypes';

export type DuplicateDecision = { left:string; right:string; decision:'link'|'separate'; at:string; actor:string };
export const duplicatePairKey = (a:string,b:string) => JSON.stringify([a,b].sort());

/** Apply only teacher decisions. If a source has been removed, its surviving copies still form one group. */
export function duplicateIndex(records:MathQuestionRecord[], decisions:DuplicateDecision[]) {
  const parents=new Map<string,string>();
  function root(id:string) {
    let parent=id;
    while(parents.has(parent))parent=parents.get(parent)!;
    if(parent!==id)parents.set(id,parent);
    return parent;
  }
  for(const item of decisions)if(item.decision==='link'){
    const left=root(item.left),right=root(item.right);
    if(left!==right)parents.set(right,left);
  }
  const present=new Set(records.map(r=>r.id)),fallback=new Map<string,string>();
  const canonical=new Map<string,string>();
  for(const record of records){
    const group=root(record.id);
    if(!fallback.has(group))fallback.set(group,record.id);
    canonical.set(record.id,present.has(group)?group:fallback.get(group)!);
  }
  const separate=new Set(decisions.filter(d=>d.decision==='separate').map(d=>duplicatePairKey(canonical.get(d.left)??root(d.left),canonical.get(d.right)??root(d.right))));
  return {canonical,separate};
}

export function canonicalRecords(records:MathQuestionRecord[],canonical:Map<string,string>) {
  const groups=new Map<string,MathQuestionRecord[]>();
  for(const record of records){
    const id=canonical.get(record.id)??record.id;
    const group=groups.get(id)??[]; group.push(record);groups.set(id,group);
  }
  return [...groups].map(([id,members])=>({
    ...members.find(r=>r.id===id)!,
    sources:members.flatMap(r=>r.sources.map(s=>({...s,questionId:r.id}))),
  }));
}

export function candidatePairs(groups:MathDuplicateGroup[],index:ReturnType<typeof duplicateIndex>) {
  const pairs=new Map<string,{left:string;right:string;kind:MathDuplicateGroup['kind'];reason:string;score:number}>();
  for(const group of groups){
    const members=[...new Set(group.questionIds.map(id=>index.canonical.get(id)??id))];
    for(let i=0;i<members.length;i++)for(const right of members.slice(i+1)){
      const left=members[i],key=duplicatePairKey(left,right);
      if(!index.separate.has(key)&&!pairs.has(key))pairs.set(key,{left,right,kind:group.kind,reason:group.reason,score:group.score});
    }
  }
  return [...pairs.values()];
}
