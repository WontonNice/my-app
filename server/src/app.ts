import path from "node:path";
import { randomUUID } from "node:crypto";
import type { ErrorRequestHandler } from "express";
import express from "express";
import cors from "cors";
import { assessmentsRouter } from "./routes/assessments";
import { authRouter } from "./routes/auth";
import { classesRouter } from "./routes/classes";
import { healthRouter } from "./routes/health";
import { libraryRouter } from "./routes/library";
import { progressRouter } from "./routes/progress";
import { examReviewRouter } from "./routes/examReview";
import { staffRouter } from "./routes/staff";
import { learningPlanRouter } from "./routes/learningPlan";
import { answerSheetsRouter } from "./routes/answerSheets";
import { boardsRouter } from "./routes/boards";
import { achievementsRouter } from "./routes/achievements";
import { gameRoomsRouter } from "./routes/gameRooms";
import { accountRouter } from "./routes/account";
import { mathCommandRouter } from "./routes/mathCommand";
import { infinitePracticeRouter } from "./routes/infinitePractice";

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
    // Configure only when deployed behind a known reverse proxy (e.g. Render).
    const trustedProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 0);
    if (Number.isInteger(trustedProxyHops) && trustedProxyHops > 0 && trustedProxyHops <= 3) app.set("trust proxy", trustedProxyHops);
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
    app.use("/api/library", libraryRouter);
    app.use("/api/progress", progressRouter);
    app.use("/api/exam-review", examReviewRouter);
    app.use("/api/staff", staffRouter);
    app.use("/api/learning-plan", learningPlanRouter);
    app.use("/api/boards", boardsRouter);
    app.use("/api/achievements", achievementsRouter);
    app.use("/api/game-rooms", gameRoomsRouter);
    app.use("/api/account", accountRouter);
    app.use("/api/answer-sheets", answerSheetsRouter);
    app.use("/api/math-command", mathCommandRouter);
    app.use("/api/infinite-practice", infinitePracticeRouter);

    app.use("/api", (_request, response) => {
        response.status(404).json({ message: "API endpoint not found.", requestId: response.locals.requestId });
    });

    app.use(express.static(clientDistPath, {
        index: false,
        setHeaders(response, filePath) {
            if (path.extname(filePath).toLowerCase() === ".svgz") {
                response.setHeader("Content-Encoding", "gzip");
                response.setHeader("Content-Type", "image/svg+xml");
            }
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
