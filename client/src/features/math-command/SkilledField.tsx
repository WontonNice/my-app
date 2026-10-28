import { resolveSkilled, type MathClassificationSkill } from '../../../../server/src/shared/mathClassificationSkills';
export function SkilledField({value,category,topic,skills,onChange,onManage}:{value?:string;category:string;topic:string;skills:MathClassificationSkill[];onChange:(id:string)=>void;onManage:()=>void}) {
  return <div className="ps-skilled-field"><label>Skilled<select value={resolveSkilled(value,category,topic,skills)} onChange={event=>onChange(event.target.value)}><option value="TBD">TBD</option>{skills.filter(skill=>skill.category===category&&skill.subcategory===topic).map(skill=><option value={skill.id} key={skill.id}>{skill.label}</option>)}</select></label><button type="button" onClick={onManage}>Manage Skilled</button></div>;
}
