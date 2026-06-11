import path from "node:path";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";

type CreateAppOptions = {
    allowedOrigins: string[];
    clientDistPath: string;
};

function createCorsOptions(allowedOrigins: string[]): cors.CorsOptions {
    return {
        origin(origin, callback) {
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    };
}

export function createApp({ allowedOrigins, clientDistPath }: CreateAppOptions) {
    const app = express();

    app.use(cors(createCorsOptions(allowedOrigins)));
    app.use(express.json());
    app.use(express.static(clientDistPath));

    app.use("/health", healthRouter);

    app.get(/.*/, (_request, response) => {
        response.sendFile(path.join(clientDistPath, "index.html"));
    });

    return app;
}
