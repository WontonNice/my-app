import { AsyncLocalStorage } from 'node:async_hooks';
import path from 'node:path';
import type { SkillModule } from '../shared/mathClassificationSkills';
const context=new AsyncLocalStorage<{root:string;modules:SkillModule[];revision:number}>();
export function practiceSkillSnapshot(root:string){const value=context.getStore();return value&&path.resolve(value.root)===path.resolve(root)?value:undefined;}
export function withPracticeSkillSnapshot<T>(root:string,modules:SkillModule[],revision:number,operation:()=>T){return context.run({root,modules,revision},operation);}
