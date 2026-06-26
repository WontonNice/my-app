import path from "node:path";
import express from "express";
import cors from "cors";
import { assessmentsRouter } from "./routes/assessments";
import { authRouter } from "./routes/auth";
import { classesRouter } from "./routes/classes";
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
    app.use("/api/assessments", assessmentsRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/classes", classesRouter);

    app.get(/.*/, (_request, response) => {
        response.sendFile(path.join(clientDistPath, "index.html"));
    });

    return app;
}
