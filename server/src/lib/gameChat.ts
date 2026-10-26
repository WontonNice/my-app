import type { GameRoom, GamePlayer } from "../shared/gameRooms";

export function sendTeamChat(room: GameRoom, player: GamePlayer, body: Record<string, unknown>, now: number) {
  const fail = (message: string, status = 400): never => { throw Object.assign(new Error(message), { status }); };
  const team = room.teams.find(item => item.id === player.teamId);
  if (room.mode !== "teams" || !team || player.excusedAt) return fail("Join an active team to send a message.", 403);
  if (typeof body.text !== "string" || !body.text.trim() || body.text.trim().length > 500) return fail("Write a message from 1 to 500 characters.");
  if (typeof body.messageId !== "string" || !/^[a-zA-Z0-9-]{8,80}$/.test(body.messageId)) return fail("Refresh the chat and try again.");
  const messages = team.messages ?? [];
  // A retried send must not duplicate a message after a CAS conflict or reconnect.
  if (messages.some(message => message.id === body.messageId && message.playerId === player.id)) return;
  if (messages.some(message => message.id === body.messageId)) return fail("Try sending that message again.", 409);
  const previous = [...messages].reverse().find(message => message.playerId === player.id);
  if (previous && now - previous.at < 800) return fail("Give your teammates a moment before sending again.", 429);
  team.messages = [...messages, { id: body.messageId, playerId: player.id, name: player.name, text: body.text.trim(), at: now }].slice(-100);
}
