import { Router, type ErrorRequestHandler } from "express";
import { createGame, fetchGame, gameCatalog, gameUser, listGames, updateGame } from "../lib/gameStore";
import { gameError, gameView, type GameActor } from "../lib/gameEngine";

export const gameRoomsRouter = Router();
gameRoomsRouter.use(async (request, response, next) => { try { response.locals.actor = await gameUser(request.headers.authorization); next(); } catch (error) { next(error); } });
gameRoomsRouter.get("/", async (_request, response) => response.json({ rooms: await listGames(response.locals.actor) }));
gameRoomsRouter.get("/catalog", (_request, response) => {
  if (!(response.locals.actor as GameActor).teacher) throw gameError("Teacher access is required.", 403);
  response.json(gameCatalog());
});
gameRoomsRouter.post("/", async (request, response) => { const actor = response.locals.actor as GameActor; response.status(201).json({ room: gameView(await createGame(actor, request.body ?? {}), actor, Date.now()) }); });
gameRoomsRouter.post("/join", async (request, response) => {
  const actor = response.locals.actor as GameActor, code = String(request.body?.code ?? "").trim().toUpperCase();
  const room = await fetchGame(code, true); response.json({ room: gameView(await updateGame(room.id, actor, "join"), actor, Date.now()) });
});
gameRoomsRouter.get("/:id", async (request, response) => { const actor = response.locals.actor as GameActor; response.json({ room: gameView(await updateGame(String(request.params.id), actor), actor, Date.now()) }); });
gameRoomsRouter.delete("/:id", async (request, response) => { await updateGame(String(request.params.id), response.locals.actor, "delete"); response.json({ removed: true }); });
gameRoomsRouter.post("/:id/action", async (request, response) => {
  if (typeof request.body?.action !== "string" || request.body.action === "join") throw gameError("Choose a valid room action.");
  const actor = response.locals.actor as GameActor; response.json({ room: gameView(await updateGame(String(request.params.id), actor, request.body.action, request.body), actor, Date.now()) });
});
const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) { next(error); return; }
  const status = typeof error?.status === "number" ? error.status : 500;
  if (status === 500) console.error("Game room request failed", error);
  response.status(status).json({ message: status === 500 ? "The room could not update. Try again." : error.message });
};
gameRoomsRouter.use(errorHandler);
