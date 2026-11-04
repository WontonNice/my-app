import { managedGeneratorIds, practiceModuleKind, type ManagedPracticeModule, type PracticeCatalog, type PracticeSelection } from '../../../../server/src/shared/practiceCatalog';

export type FoundationPreferences={excludedModuleIds:string[];includeUnassigned:boolean};
export const foundationPreferencesEvent='infinite-practice:foundation-preferences';
const key=(owner:string,moduleId:string)=>`infinite-practice:foundation-settings:v1:${encodeURIComponent(owner)}:${encodeURIComponent(moduleId)}`;
export function readFoundationPreferences(storage:Pick<Storage,'getItem'>,owner:string,moduleId:string):FoundationPreferences {
  const defaults={excludedModuleIds:[],includeUnassigned:true};
  const raw=storage.getItem(key(owner,moduleId));
  if(!raw)return defaults;
  try{
    const value=JSON.parse(raw);
    if(!value||!Array.isArray(value.excludedModuleIds)||value.excludedModuleIds.length>1000||!value.excludedModuleIds.every((id:unknown)=>typeof id==='string'&&id.length<250)||typeof value.includeUnassigned!=='boolean')return defaults;
    return {excludedModuleIds:[...new Set<string>(value.excludedModuleIds)],includeUnassigned:value.includeUnassigned};
  }catch{return defaults;}
}
export function saveFoundationPreferences(storage:Pick<Storage,'setItem'>,owner:string,moduleId:string,value:FoundationPreferences){
  storage.setItem(key(owner,moduleId),JSON.stringify(value));
  if(typeof window!=='undefined')window.dispatchEvent(new Event(foundationPreferencesEvent));
}
export function foundationOptions(module:ManagedPracticeModule,catalog:PracticeCatalog){
  const available=new Set(managedGeneratorIds(module,catalog));
  const modules=catalog.modules.filter(child=>!practiceModuleKind(child)&&child.published&&child.category===module.category&&child.topic===module.topic&&managedGeneratorIds(child,catalog).some(id=>available.has(id)));
  const grouped=new Set(modules.flatMap(child=>managedGeneratorIds(child,catalog)));
  return {modules,unassigned:[...available].filter(id=>!grouped.has(id))};
}
export function foundationSelection(module:ManagedPracticeModule,catalog:PracticeCatalog,preferences:FoundationPreferences):PracticeSelection {
  return {childModuleIds:foundationOptions(module,catalog).modules.filter(child=>!preferences.excludedModuleIds.includes(child.id)).map(child=>child.id),includeUnassigned:preferences.includeUnassigned};
}
