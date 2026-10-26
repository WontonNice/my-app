import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Coins, Eye, Package, RotateCw, ShoppingBag, ShieldCheck } from "lucide-react";
import { GAME_BOOSTERS, GAME_COIN_STREAK, activeTeamPlayers, hasActiveInk, type GameView } from "../../../../server/src/shared/gameRooms";
import "./sabotage-shop.css";
import { LandminePlacement } from "./LandminePlacement";

type Action = (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean>;
export function SabotageShop({ room, act, busy, now }: { room: GameView; act: Action; busy: boolean; now: number }) {
  const [using, setUsing] = useState<string | null>(null), [flipped, setFlipped] = useState<string[]>([]);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState("");
  const team = room.teams.find(item => item.id === room.me?.teamId);
  if (!room.party || !team || room.me?.excusedAt || room.phase !== "question") return null;
  const unlimited = Boolean(room.canPlaytest && room.playtest?.unlimitedCoins);
  const coins = team.coins ?? 0, progress = team.streak % GAME_COIN_STREAK;
  const affected = team.blockedUntil > now || hasActiveInk(team, now);
  const disabled = busy || team.index >= room.totalQuestions || affected;
  const selected = GAME_BOOSTERS.find(item => item.id === using);
  const count = selected ? team.inventory?.[selected.id] ?? 0 : 0;
  const opponents = room.teams.filter(item => item.id !== team.id && item.index < room.totalQuestions && activeTeamPlayers(room, item.id).length > 0);
  const lastTarget = room.teams.find(item => item.id === room.playtest?.lastTargetTeamId);
  return <section className="sabotage-shop" aria-label="Sabotage shop">
    <header className="sabotage-shop-header"><div><span><ShoppingBag size={15} />PARTY MODE · {team.name}</span><h3>The Armory</h3></div><div className="sabotage-wallet" aria-label={unlimited ? "Unlimited coins" : coins + " team coins"}><Coins size={25} /><strong>{unlimited ? "∞" : coins.toLocaleString()}</strong><small>{unlimited ? "UNLIMITED" : "TEAM COINS"}</small></div></header>
    <div className="sabotage-shop-body">
      {room.canPlaytest && <label className="sabotage-sandbox-toggle"><input type="checkbox" checked={unlimited} disabled={busy} onChange={event => { void act("test-unlimited", { enabled: event.target.checked }); }} /><span>Sandbox · Unlimited coins</span><small>Buy freely</small></label>}
      <div className="sabotage-streak"><span>Next streak bonus: +{(Math.floor(team.streak / GAME_COIN_STREAK) + 1) * 100}</span><div aria-label={progress + " of 3 correct toward next coin"}>{Array.from({length: GAME_COIN_STREAK}, (_, index) => <i key={index} className={index < progress ? "is-earned" : ""} />)}</div><strong>{progress}/{GAME_COIN_STREAK}</strong><small>+100 per correct · Passage awards post together</small></div>
      {team.coinReceipt && <p className="sabotage-earnings">Last checkpoint: +{team.coinReceipt.base} correct{team.coinReceipt.bonus > 0 ? " · +" + team.coinReceipt.bonus + " streak bonus" : ""}{team.coinReceipt.penalty > 0 ? " · −" + team.coinReceipt.penalty + " landmine" : ""}</p>}
      <div className="sabotage-section-label"><h4>Choose your move</h4><span>Tap a card to flip it</span></div>
      <div className="sabotage-cards">{GAME_BOOSTERS.map(item => {
        const back = flipped.includes(item.id), owned = team.inventory?.[item.id] ?? 0;
        return <article key={item.id} className={"sabotage-card " + item.id}>
          <button className={"sabotage-card-flip" + (back ? " is-flipped" : "")} aria-label={(back ? "Show " : "Learn about ") + item.name} aria-pressed={back} onClick={() => setFlipped(current => back ? current.filter(id => id !== item.id) : [...current, item.id])}>
            <span className="sabotage-card-turn">
              <span className="sabotage-card-front" aria-hidden={back}><span className="sabotage-card-kind">{item.kind}</span><span className="sabotage-card-owned">×{owned} owned</span><span className="sabotage-art"><img src={item.image} alt="" draggable={false} /></span><strong>{item.name}</strong><span className="sabotage-card-stat">{item.stat}</span><span className="sabotage-flip-hint"><RotateCw size={12} />How it works</span></span>
              <span className="sabotage-card-back" aria-hidden={!back}><span className="sabotage-card-kind">{item.kind}</span><strong>{item.name}</strong><span className="sabotage-description">{item.description}</span><span className="sabotage-counter"><ShieldCheck size={18} /><span>{item.counter}</span></span><span className="sabotage-flip-hint"><ArrowLeft size={12} />Back to artwork</span></span>
            </span>
          </button>
          <button className="sabotage-buy" disabled={disabled || !unlimited && coins < item.cost} onClick={() => { setReceipt(""); void act("buy-sabotage", { boosterId: item.id }).then(ok => { if (ok) setReceipt(item.name + " added to your inventory" + (unlimited ? " · Sandbox purchase" : " · " + item.cost + " coins spent")); }); }}><span>{!unlimited && coins < item.cost ? "Need " + item.cost + " coins" : "Buy " + item.name}</span><strong><Coins size={17} />{item.cost}</strong></button>
        </article>;
      })}</div>
      {affected && <p className="sabotage-shop-status">Your team is sabotaged. Clear the effect to use the shop.{room.canPlaytest && <button disabled={busy} onClick={() => { void act("test-clear-effects"); }}>Clear effects</button>}</p>}
      <section className="sabotage-inventory" aria-label="Team sabotage inventory"><div className="sabotage-section-label"><h4><Package size={17} />Your inventory</h4><span>Shared with your team</span></div><div>{GAME_BOOSTERS.map(item => <article key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>×{team.inventory?.[item.id] ?? 0} ready</span></div><button disabled={disabled || !(team.inventory?.[item.id] ?? 0)} aria-label={"Use " + item.name} aria-pressed={using === item.id} onClick={() => { setUsing(item.id); setTargetId(null); setReceipt(""); }}>Use <ArrowRight size={14} /></button></article>)}</div></section>
      {selected && <section className="sabotage-targets" aria-label={"Choose a team for " + selected.name}><header><h4>Send {selected.name}</h4><button onClick={() => { setUsing(null); setTargetId(null); }}>Cancel</button></header><p>Choose the opposing team to use one item.</p>{!count && <p role="status">Your teammate used the last one. Restock above.</p>}{!opponents.length && <p>No active opponents. {room.canPlaytest ? "Switch to a finished team and jump to a question in Sandbox to keep testing." : "All other teams have finished."}</p>}<div>{opponents.map(opponent => {
        const unavailable = selected.id !== "landmine" && (opponent.blockedUntil > now || hasActiveInk(opponent, now));
        const noNext = selected.id === "landmine" && !(room.mineTargets.find(item => item.teamId === opponent.id)?.questions.length);
        return <button key={opponent.id} disabled={disabled || !count || unavailable || noNext} onClick={() => { if (selected.id === "landmine") { setTargetId(opponent.id); return; } void act("use-sabotage", { boosterId: selected.id, teamId: opponent.id }).then(ok => { if (ok) { setUsing(null); setReceipt(selected.name + " sent to " + opponent.name + "."); } }); }}><strong>{opponent.name}</strong><span>{activeTeamPlayers(room, opponent.id).map(player => player.name).join(" · ")}</span><small>{unavailable ? "Effect already active" : noNext ? "No choice questions left" : selected.id === "landmine" ? "Choose question & answer →" : "Send " + selected.name + " →"}</small></button>;
      })}</div>{selected.id === "landmine" && targetId && <LandminePlacement key={targetId} room={room} teamId={targetId} busy={disabled || !count} act={act} onSent={name => { setUsing(null); setTargetId(null); setReceipt("Landmine planted for " + name + "."); }} />}</section>}
      <div className="sabotage-receipt" role="status">{receipt ? <><Check size={16} /><span>{receipt}</span></> : <span>Buy an item, then use it from your team inventory.</span>}</div>
      {room.canPlaytest && lastTarget && <button className="sabotage-follow" disabled={busy} onClick={() => { void act("test-view-target"); }}><Eye size={17} />Play as {lastTarget.name} · See the receiving side<ArrowRight size={17} /></button>}
    </div>
  </section>;
}
