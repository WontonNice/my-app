import { useState } from "react";
import { Bomb, Coins, Droplets, ShoppingBag } from "lucide-react";
import { GAME_BOOSTERS, GAME_COIN_STREAK, hasActiveInk, type GameView } from "../../../../server/src/shared/gameRooms";

type Action = (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean>;
export function SabotageShop({ room, act, busy, now }: { room: GameView; act: Action; busy: boolean; now: number }) {
  const [target, setTarget] = useState("");
  const [receipt, setReceipt] = useState("");
  const team = room.teams.find(item => item.id === room.me?.teamId);
  if (!room.party || !team || room.phase !== "question") return null;
  const opponents = room.teams.filter(item => item.id !== team.id && item.index < room.totalQuestions);
  const targetId = opponents.some(item => item.id === target) ? target : opponents[0]?.id ?? "";
  const opponent = opponents.find(item => item.id === targetId);
  const coins = team.coins ?? 0, progress = team.streak % GAME_COIN_STREAK;
  const disabled = busy || team.index >= room.totalQuestions || team.blockedUntil > now || hasActiveInk(team, now) || !opponent || opponent.blockedUntil > now || hasActiveInk(opponent, now);
  return <section className="game-shop" aria-label="Sabotage shop">
    <header><div><span className="game-shop-eyebrow"><ShoppingBag size={16} />Team sabotage shop</span><h3>A little friendly interference.</h3></div><strong className="game-wallet"><Coins size={22} />{coins}<small>{coins === 1 ? "coin" : "coins"}</small></strong></header>
    <p>Earn 1 shared team coin for every 3 correct answers in a row. Choose a rival, then buy and send a sabotage.</p>
    <div className="game-coin-progress"><span>{progress} / 3 toward your next coin</span><progress max={3} value={progress} /><small>{team.streak} correct in a row</small></div>
    <label className="game-shop-target">Send to<select aria-label="Sabotage target" value={targetId} disabled={busy || !opponents.length} onChange={event => { setTarget(event.target.value); setReceipt(""); }}><option value="" disabled>No active opponents</option>{opponents.map(item => <option key={item.id} value={item.id}>{item.name}{item.blockedUntil > now || hasActiveInk(item, now) ? " · Sabotaged" : ""}</option>)}</select></label>
    <div className="game-shop-items">{GAME_BOOSTERS.map(item => <article key={item.id} className={`game-shop-item ${item.id}`}>
      <div className="game-shop-icon">{item.id === "landmine" ? <Bomb size={30} /> : <Droplets size={30} />}</div><div className="game-shop-item-title"><h4>{item.name}</h4><strong><Coins size={15} />{item.cost} coin</strong></div>
      <p>{item.description}</p><small>{item.id === "landmine" ? "Hidden until graded · 5-second penalty" : "Clear together · Fades after 8 seconds"}</small>
      <button className="game-primary" disabled={disabled || coins < item.cost} onClick={() => { setReceipt(""); void act("buy-sabotage", { boosterId: item.id, teamId: targetId }).then(ok => { if (ok) setReceipt(`${item.name} sent to ${opponent?.name}. ${item.cost} coin spent.`); }); }}>{coins < item.cost ? "Earn 1 coin to buy" : `Buy & send ${item.name}`}</button>
    </article>)}</div>
    <p className="game-shop-receipt" role="status">{receipt || (opponent && (opponent.blockedUntil > now || hasActiveInk(opponent, now)) ? "This team is already sabotaged. Choose another team or wait." : "Purchases use your team's shared coins. Agree on your target together!")}</p>
  </section>;
}
