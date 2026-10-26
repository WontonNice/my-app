import { Eye, FlaskConical, Gamepad2 } from "lucide-react";
import type { CrystalTeacherMode } from "../../../../../server/src/shared/crystalDefense";

export function TeacherWorldControls({ mode, busy, onMode }: { mode: CrystalTeacherMode; busy: boolean; onMode: (mode: CrystalTeacherMode) => void }) {
  return <div className="world-teacher-modes" aria-label="Teacher mode">
    <div role="group" aria-label="Choose teacher mode">
      {([{ id: "play", label: "Play", Icon: Gamepad2 }, { id: "spectate", label: "Spectate", Icon: Eye }, { id: "playtest", label: "Playtest", Icon: FlaskConical }] as const).map(({ id, label, Icon }) => <button type="button" key={id} aria-pressed={mode === id} disabled={busy} onClick={() => onMode(id)}><Icon size={16} />{label}</button>)}
    </div>
    <p>{mode === "spectate" ? "Watch your class and manage the game without joining as a defender." : mode === "playtest" ? "Admin controls and your test buddy are enabled. Changes affect this room." : "Join as a defender. Select Playtest when you need admin controls."}</p>
  </div>;
}

export function SpectatorCameraControls({ players, followId, onFollow }: { players: { id: string; name: string }[]; followId: string; onFollow: (id: string) => void }) {
  return <aside className="world-spectator-camera" aria-label="Spectator camera">
    <strong><Eye size={16} />Spectating</strong>
    <label>Camera<select value={players.some(player => player.id === followId) ? followId : ""} onChange={event => onFollow(event.target.value)}><option value="">Free camera</option>{players.map(player => <option key={player.id} value={player.id}>Follow {player.name}</option>)}</select></label>
    <span>WASD to pan · Drag to look · Scroll to zoom</span>
  </aside>;
}
