import "dotenv/config";
import path from "node:path";
import { createApp } from "./app";
import { env } from "./config/env";
import { attachBoardRealtime } from "./lib/boardRealtime";
import { attachGameRealtime } from "./lib/gameRealtime";

const clientDistPath = path.resolve(__dirname, "../../client/dist");
const app = createApp({
    allowedOrigins: env.allowedOrigins,
    clientDistPath,
});

const server = app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});
attachBoardRealtime(server, env.allowedOrigins);
attachGameRealtime(server, env.allowedOrigins);
