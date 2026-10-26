export type WorldCharacterId = "astronaut" | "frog" | "mushroom" | "alien" | "wizard" | "duck" | "tung-tung" | "le-sunshine" | "mike" | "pepe";
export type WorldPose = { x: number; y: number; z: number; rotation: number; moving: boolean };
export type WorldEmote = "wave" | "dance" | "cheer" | "hello";
export type WorldPresence = { id: string; name: string; character: WorldCharacterId; pose: WorldPose; emote?: WorldEmote; emoteAt?: number; testOwnerId?: string };

export const WORLD_CHARACTERS: { id: WorldCharacterId; name: string; description: string; color: string }[] = [
  { id: "tung-tung", name: "Tung Tung Tung Sahur", description: "The wooden legend, bat in hand", color: "#c78642" },
  { id: "le-sunshine", name: "LeBron · Le Sunshine", description: "You are my sunshine", color: "#ffd66b" },
  { id: "mike", name: "Mike Wazowski", description: "One big eye. One even bigger smile.", color: "#a1cb41" },
  { id: "pepe", name: "Pepe the Frog", description: "Big eyes, blue shirt, and a familiar smile", color: "#75a34e" },
  { id: "astronaut", name: "Orbit", description: "A little explorer with big dreams", color: "#e9f4ff" },
  { id: "frog", name: "Hopper", description: "Your friendly neighborhood frog", color: "#8ecf66" },
  { id: "mushroom", name: "Sprout", description: "Small cap. Big personality.", color: "#ee737c" },
  { id: "alien", name: "Ziggy", description: "Visiting from somewhere wonderful", color: "#8dd8bd" },
  { id: "wizard", name: "Wisp", description: "A pocketful of everyday magic", color: "#b2a1ed" },
  { id: "duck", name: "Puddles", description: "Always ready to make a splash", color: "#ffd568" },
];
export const WORLD_EMOTES: { id: WorldEmote; label: string; emoji: string }[] = [
  { id: "wave", label: "Wave", emoji: "👋" },
  { id: "dance", label: "Dance", emoji: "🎵" },
  { id: "cheer", label: "Cheer", emoji: "🎉" },
  { id: "hello", label: "Hello!", emoji: "💬" },
];
export const WORLD_MAX_PLAYERS = 32;
export const WORLD_BOUNDARY = 23;
export const WORLD_SPAWN: WorldPose = { x: 0, y: 0, z: 6, rotation: 0, moving: false };
