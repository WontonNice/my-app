import type { LandmineResult } from "../../../../server/src/shared/gameRooms";
import "./landmine-outcome.css";

export function LandmineOutcome({ result, now }: { result?: LandmineResult; now: number }) {
  if (!result || now - result.at >= 6500 || now < result.at) return null;
  const exploded = result.outcome === "triggered";
  const traps = result.traps ?? [result];
  const defused = traps.filter(trap => trap.outcome === "defused").length;
  const hit = traps.filter(trap => trap.outcome === "triggered").length;
  const survived = traps.length - defused - hit;
  const title = exploded ? "LANDMINE HIT" : defused ? "LANDMINE DEFUSED" : "LANDMINE SURVIVED";
  const message = exploded ? `−${result.coinsLost ?? 100} coins` : defused ? `You defused ${defused === 1 ? "the landmine" : `${defused} landmines`}!` : result.outcome === "disarmed" ? "You survived a landmine!" : "You avoided the trapped choice.";
  return <div key={result.at} className={`landmine-outcome ${exploded ? "is-exploded" : "is-survived"}`} role="status">
    {exploded && <div className="landmine-burst" aria-hidden="true"><i /><i /><i />{Array.from({length:12},(_,index)=><b key={index} style={{transform:`rotate(${index*30}deg)`}} />)}</div>}
    <div className="landmine-result-card"><span>{title}</span><strong>{message}</strong>{traps.length > 1 ? <p>{traps.length} traps cleared · {[hit && `${hit} exploded`, defused && `${defused} defused with correct answers`, survived && `${survived} survived`].filter(Boolean).join(" · ")}</p> : <p>{defused ? "Correct answer. No coins lost." : <>{result.source.teamName}'s trap{result.questionIndex !== undefined ? ` on Q${result.questionIndex+1}` : ""}{exploded ? result.coinsLost === 0 ? " hit, but your wallet was empty." : " exploded." : " is cleared."}</>}</p>}</div>
  </div>;
}
