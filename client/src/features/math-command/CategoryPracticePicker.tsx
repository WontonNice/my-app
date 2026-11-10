import { useMemo, useRef, useState } from 'react';
import type { PracticeCatalog } from '../../../../server/src/shared/practiceCatalog';
import { practiceMix } from '../../../../server/src/shared/practiceSources';
import { InequalityPractice } from './InequalityPractice';
import './category-practice.css';

type Taxonomy = { label: string; topics: string[] }[];
export function CategoryPracticePicker({ catalog, taxonomy, category = '', topic = '', teacher = false }: { catalog: PracticeCatalog; taxonomy: Taxonomy; category?: string; topic?: string; teacher?: boolean }) {
  const [chosenCategory, setCategory] = useState(category);
  const [publishers, setPublishers] = useState<string[] | undefined>();
  const [running, setRunning] = useState<ReturnType<typeof practiceMix> | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const mix = useMemo(() => practiceMix(catalog, taxonomy, { category: chosenCategory, topic, publishers }), [catalog, taxonomy, chosenCategory, topic, publishers]);
  const gaps = mix.coverage.filter(item => !item.count);
  const sources = [...new Set(['Official Handbook', 'Prestige', ...mix.sources])];
  return <section className="category-practice" aria-label="Mixed math practice">
    <header><h3>{topic || chosenCategory || 'All Math'} infinite practice</h3><p>Mix existing published generators across your selected topics and sources.</p></header>
    {!category && <label className="category-practice-category">Math category<select value={chosenCategory} onChange={event => { setCategory(event.target.value); setPublishers(undefined); }}><option value="">All Math</option>{taxonomy.map(item => <option key={item.label}>{item.label}</option>)}</select></label>}
    <fieldset><legend>Sources</legend>{sources.map(source => {
      const available = mix.sources.includes(source);
      const checked = publishers ? publishers.includes(source) : available;
      return <label key={source}><input type="checkbox" checked={checked} disabled={!available} onChange={event => setPublishers(event.target.checked ? [...(publishers ?? mix.sources), source] : (publishers ?? mix.sources).filter(value => value !== source))} />{source === 'Official Handbook' ? 'Official' : source}{!available && <small> No available generators</small>}</label>;
    })}<button type="button" onClick={() => setPublishers(undefined)}>Select all sources</button></fieldset>
    <p role="status">{mix.generators.length} generators · {mix.coverage.length - gaps.length} of {mix.coverage.length} topics covered</p>
    {gaps.length > 0 && <details><summary>Coverage gaps ({gaps.length})</summary><p>These topics have no published generators matching the selected sources.</p><ul>{gaps.map(item => <li key={`${item.category}/${item.topic}`}>{chosenCategory ? item.topic : `${item.category} / ${item.topic}`}</li>)}</ul></details>}
    {!mix.generators.length && <p>Choose another source or category to find available practice.</p>}
    <button ref={trigger} className="category-practice-start" type="button" disabled={!mix.generators.length} onClick={() => setRunning(mix)}>{teacher ? 'Preview' : 'Open'} {mix.title} practice</button>
    {running && <InequalityPractice key={running.id} catalog={running.catalog} initialModuleId={running.id} previewOnly={teacher} onClose={() => { setRunning(null); trigger.current?.focus(); }} />}
  </section>;
}
