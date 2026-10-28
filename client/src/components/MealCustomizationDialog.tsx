import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { mealMoney, type MealItem } from '../../../server/src/shared/classroomMeals';

export function MealCustomizationDialog({ item, initial, onClose, onConfirm }: { item: MealItem; initial: Record<string, string[]>; onClose: () => void; onConfirm: (choices: Record<string, string[]>) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [choices, setChoices] = useState(initial);
  const groups = item.optionGroups ?? [];
  const valid = groups.every(group => (!group.required || (choices[group.id]?.length ?? 0) > 0) && (choices[group.id]?.length ?? 0) <= group.maxChoices && (choices[group.id] ?? []).every(id => group.options.some(option => option.id === id)));
  useEffect(() => { const node = dialog.current; node?.showModal(); return () => node?.close(); }, []);
  return <dialog ref={dialog} className="meal-customization-dialog" aria-labelledby="meal-customize-title" onCancel={onClose}>
    <div className="meal-dialog-heading"><h2 id="meal-customize-title">Customize {item.name}</h2><button type="button" aria-label="Close customizations" onClick={onClose}><X size={20} /></button></div>
    <p className="meal-fineprint">These choices apply to every quantity of this item in your request.</p>
    {groups.map(group => <fieldset key={group.id} className="meal-option-choices"><legend>{group.name} <span>{group.required ? 'Required' : 'Optional'}</span></legend><p>{group.required ? 'Choose at least 1' : 'Choose up to ' + group.maxChoices}{group.required && ` · maximum ${group.maxChoices}`}</p>
      {group.options.map(option => { const selected = choices[group.id] ?? []; return <label key={option.id}><span>{option.name}<small>{option.extraCents ? '+' + mealMoney(option.extraCents) : 'Included'}</small></span><input type={group.maxChoices === 1 ? 'radio' : 'checkbox'} name={group.id} checked={selected.includes(option.id)} onChange={() => setChoices(current => ({ ...current, [group.id]: group.maxChoices === 1 ? [option.id] : selected.includes(option.id) ? selected.filter(id => id !== option.id) : [...selected, option.id] }))} disabled={group.maxChoices > 1 && !selected.includes(option.id) && selected.length >= group.maxChoices} /></label>; })}
      {!group.required && (choices[group.id]?.length ?? 0) > 0 && <button type="button" onClick={() => setChoices(current => ({ ...current, [group.id]: [] }))}>Clear {group.name}</button>}
    </fieldset>)}
    <button type="button" className="meal-primary" disabled={!valid} onClick={() => onConfirm(choices)}>Save choices</button>{!valid && <p role="status">Complete the required choices to continue.</p>}
  </dialog>;
}
