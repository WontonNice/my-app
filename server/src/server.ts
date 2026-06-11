import "dotenv/config";
import path from "node:path";
import { createApp } from "./app";
import { env } from "./config/env";

const clientDistPath = path.resolve(__dirname, "../../client/dist");
const app = createApp({
    allowedOrigins: env.allowedOrigins,
    clientDistPath,
});

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
});
