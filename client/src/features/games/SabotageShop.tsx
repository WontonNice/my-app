import { useState } from "react";
import { Bomb, Coins, Droplets, Package, ShoppingBag } from "lucide-react";
import { GAME_BOOSTERS, GAME_COIN_STREAK, activeTeamPlayers, hasActiveInk, type GameView } from "../../../../server/src/shared/gameRooms";

type Action = (action: string, body?: Record<string, unknown>, quiet?: boolean) => Promise<boolean>;
export function SabotageShop({ room, act, busy, now }: { room: GameView; act: Action; busy: boolean; now: number }) {
  const [using, setUsing] = useState<string | null>(null);
  const [receipt, setReceipt] = useState("");
  const team = room.teams.find(item => item.id === room.me?.teamId);
  if (!room.party || !team || room.me?.excusedAt || room.phase !== "question") return null;
  const coins = team.coins ?? 0, progress = team.streak % GAME_COIN_STREAK;
  const disabled = busy || team.index >= room.totalQuestions || team.blockedUntil > now || hasActiveInk(team, now);
  const selected = GAME_BOOSTERS.find(item => item.id === using);
  const count = selected ? team.inventory?.[selected.id] ?? 0 : 0;
  const opponents = room.teams.filter(item => item.id !== team.id && item.index < room.totalQuestions && activeTeamPlayers(room, item.id).length > 0);
  return <section className="game-shop" aria-label="Sabotage shop">
    <header><div><span className="game-shop-eyebrow"><ShoppingBag size={16} />Team sabotage shop</span><h3>Buy now. Choose your moment.</h3></div><strong className="game-wallet"><Coins size={22} />{coins}<small>{coins === 1 ? "coin" : "coins"}</small></strong></header>
    <p>Earn 1 shared team coin for every 3 correct answers in a row. Purchases stay in your team's inventory until you use them.</p>
    <div className="game-coin-progress"><span>{progress} / 3 toward your next coin</span><progress max={3} value={progress} /><small>{team.streak} correct in a row</small></div>
    <div className="game-shop-items">{GAME_BOOSTERS.map(item => <article key={item.id} className={`game-shop-item ${item.id}`}>
      <div className="game-shop-icon">{item.id === "landmine" ? <Bomb size={30} /> : <Droplets size={30} />}</div><div className="game-shop-item-title"><h4>{item.name}</h4><strong><Coins size={15} />{item.cost} coin</strong></div>
      <p>{item.description}</p><small>{item.id === "landmine" ? "Hidden until graded · 5-second penalty" : "Clear together · Fades after 30 seconds"}</small>
      <button className="game-primary" disabled={disabled || coins < item.cost} onClick={() => { setReceipt(""); void act("buy-sabotage", { boosterId: item.id }).then(ok => { if (ok) setReceipt(`${item.name} added to your team's inventory. ${item.cost} coin spent.`); }); }}>Buy {item.name} · {item.cost} coin</button>
    </article>)}</div>
    <section className="game-inventory" aria-label="Team sabotage inventory"><h4><Package size={19} />Team inventory</h4><p>Choose Use, then pick the team you want to sabotage.</p><div className="game-inventory-items">{GAME_BOOSTERS.map(item => <div key={item.id}><strong>{item.name} <span>×{team.inventory?.[item.id] ?? 0}</span></strong><button disabled={disabled || !(team.inventory?.[item.id] ?? 0)} onClick={() => { setUsing(item.id); setReceipt(""); }}>Use {item.name}</button></div>)}</div></section>
    {selected && <section className="game-target-picker" aria-label={`Choose a team for ${selected.name}`}>
      <header><h4>Use {selected.name} on…</h4><button onClick={() => setUsing(null)}>Cancel</button></header>
      <p>Choose a team below to send it. This uses one item from your shared inventory.</p>
      {!count && <p role="status">A teammate used the last one. Buy another to restock.</p>}
      {!opponents.length && <p>No active opposing teams are available.</p>}
      <div>{opponents.map(opponent => {
        const unavailable = opponent.blockedUntil > now || hasActiveInk(opponent, now);
        return <button key={opponent.id} disabled={disabled || !count || unavailable} onClick={() => {
          void act("use-sabotage", { boosterId: selected.id, teamId: opponent.id }).then(ok => { if (ok) { setUsing(null); setReceipt(`${selected.name} sent to ${opponent.name}.`); } });
        }}><strong>{opponent.name}</strong><span>{room.players.filter(player => player.teamId === opponent.id).map(player => `${player.name}${player.excusedAt ? " (left class)" : ""}`).join(", ")}</span><small>{unavailable ? "Sabotaged · wait for this effect to end" : `Send ${selected.name}`}</small></button>;
      })}</div>
    </section>}
    <p className="game-shop-receipt" role="status">{receipt || "Coins and inventory are shared by your team. Coordinate before using an item!"}</p>
  </section>;
}
