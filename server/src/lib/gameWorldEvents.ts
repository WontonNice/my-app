import { EventEmitter } from "node:events";
import type { GameRoom } from "../shared/gameRooms";

/** Local lifecycle events are relayed by each attached world transport. */
export const worldRoomEvents = new EventEmitter();
export function notifyWorldRoomChange(room: GameRoom) { worldRoomEvents.emit("room", room); }
