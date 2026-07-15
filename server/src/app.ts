import path from "node:path";
import { randomUUID } from "node:crypto";
import type { ErrorRequestHandler } from "express";
import express from "express";
import cors from "cors";
import { assessmentsRouter } from "./routes/assessments";
import { authRouter } from "./routes/auth";
import { classesRouter } from "./routes/classes";
import { healthRouter } from "./routes/health";
import { progressRouter } from "./routes/progress";
import { staffRouter } from "./routes/staff";

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

    app.disable("x-powered-by");
    app.use((request, response, next) => {
        const incomingRequestId = request.header("x-request-id")?.trim().slice(0, 128);
        const requestId = incomingRequestId || randomUUID();
        response.locals.requestId = requestId;
        response.setHeader("x-request-id", requestId);
        if (request.path.startsWith("/api/") || request.path.startsWith("/health")) {
            response.setHeader("Cache-Control", "no-store");
        }
        next();
    });
    app.use(cors(createCorsOptions(allowedOrigins)));
    app.use(express.json({ limit: "1mb" }));

    app.use("/health", healthRouter);
    app.use("/api/health", healthRouter);
    app.use("/api/assessments", assessmentsRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/classes", classesRouter);
    app.use("/api/progress", progressRouter);
    app.use("/api/staff", staffRouter);

    app.use("/api", (_request, response) => {
        response.status(404).json({ message: "API endpoint not found.", requestId: response.locals.requestId });
    });

    app.use(express.static(clientDistPath, {
        index: false,
        setHeaders(response, filePath) {
            response.setHeader(
                "Cache-Control",
                filePath.includes(`${path.sep}assets${path.sep}`)
                    ? "public, max-age=31536000, immutable"
                    : "no-cache",
            );
        },
    }));

    app.get(/.*/, (_request, response) => {
        response.setHeader("Cache-Control", "no-store");
        response.sendFile(path.join(clientDistPath, "index.html"));
    });

    const handleError: ErrorRequestHandler = (error, _request, response, next) => {
        if (response.headersSent) {
            next(error);
            return;
        }

        const requestId = String(response.locals.requestId ?? randomUUID());
        console.error(`[${requestId}] Unhandled request error`, error);
        const isCorsError = error instanceof Error && error.message.startsWith("CORS blocked");
        response.status(isCorsError ? 403 : 500).json({
            message: isCorsError ? "This website origin is not allowed to call the API." : "The server hit an unexpected error. Please try again.",
            requestId,
        });
    };
    app.use(handleError);

    return app;
}
