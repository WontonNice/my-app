import type { PassageEncounter } from '../lib/passageEncounters';
import { passageCompletionDate, passageSource } from '../lib/passageOrganization';
import type { PriorContentActivity } from '../lib/learningPlan';

export function PassageEncounterHistory({encounters, visibleIds, onEvidence}: {
  encounters: PassageEncounter[]; visibleIds: Set<string>; onEvidence?: (activity: PriorContentActivity) => void;
}) {
  return <section className="sa-encounter-history" aria-label="Previous passage encounters">
    <header><h4>Previous encounters</h4><small>Newest first · includes versions hidden by your filters</small></header>
    <table aria-label="Previous encounters by source version"><thead><tr><th scope="col">Source version</th><th scope="col">When</th><th scope="col">Score</th><th scope="col">Activity</th>{onEvidence && <th scope="col">Review</th>}</tr></thead>
      <tbody>{encounters.map((entry,index) => <tr key={index}>
        <td>{passageSource(entry.version)}{!visibleIds.has(entry.version.id) && <small>Hidden by current filters</small>}</td>
        <td>{passageCompletionDate(entry.at)}</td>
        <td>{entry.related ? <><span>Version score unverified</span>{entry.score && <small>Combined attempt: {entry.score.correct}/{entry.score.total}</small>}</> : entry.score ? <>{entry.score.correct}/{entry.score.total} <small>{Math.round(100*entry.score.correct/entry.score.total)}%</small></> : 'No recorded score'}</td>
        <td>{entry.source}{entry.related && <small>Related attempt · coverage unverified</small>}</td>
        {onEvidence && <td>{entry.activity && <button type="button" className="sa-link" aria-label={'View attempt for '+passageSource(entry.version)+' on '+passageCompletionDate(entry.at)} onClick={()=>onEvidence(entry.activity!)}>View attempt</button>}</td>}
      </tr>)}</tbody>
    </table>
    {!encounters.length && <p>No dated attempts or scores have been recorded for this passage.</p>}
  </section>;
}
