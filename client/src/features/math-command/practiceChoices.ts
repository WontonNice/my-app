import type { ManagedPracticeModule } from '../../../../server/src/shared/practiceCatalog';

export type PracticeChoices={hiddenChildren?:string[];hiddenTopics?:string[];configuredChildren?:string[]};
export const choiceStrings=(value:unknown):string[]=>Array.isArray(value)?value.filter(item=>typeof item==='string').slice(0,1000):[];
export function practiceChildIsHidden(child:ManagedPracticeModule,choices:PracticeChoices) {
  const hidden=choiceStrings(choices.hiddenChildren),configured=choiceStrings(choices.configuredChildren);
  return hidden.includes(child.id)||!configured.includes(child.id)&&(child.selectionAliases??[]).some(id=>hidden.includes(id));
}
/** Materialize legacy choices once so future skill switches remain independent. */
export function changePracticeChild(children:ManagedPracticeModule[],choices:PracticeChoices,id:string,show:boolean):PracticeChoices {
  return {...choices,configuredChildren:children.map(child=>child.id),hiddenChildren:children.filter(child=>child.id===id?!show:practiceChildIsHidden(child,choices)).map(child=>child.id)};
}
