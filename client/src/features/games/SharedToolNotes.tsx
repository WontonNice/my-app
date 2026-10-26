import type { SharedExamTools } from "./useTeamTools";

export function SharedToolNotes({ tools, noteKey }: { tools?: SharedExamTools; noteKey: string }) {
  const peers = tools?.peers.filter(peer => peer.state.notes[noteKey]);
  if (!peers?.length) return null;
  return <div className="game-peer-notes" aria-label="Teammate notes" aria-live="polite">
    {peers.map(peer => <div key={peer.playerId}><strong>{peer.name}</strong><p>{peer.state.notes[noteKey]}</p></div>)}
  </div>;
}
