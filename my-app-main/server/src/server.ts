import "dotenv/config";
import path from "node:path";
import express from "express";
import cors from "cors";
import RegisterRouter from "./routes/register";
import LoginRouter from "./routes/login";
import studentsRouter from "./routes/students";

const app = express();
const port = Number(process.env.PORT) || 8080;
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }

        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
};

const clientDistPath = path.resolve(__dirname, "../../client/dist");

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(clientDistPath));

app.get("/health", (_request, response) => {
    response.status(200).json({ ok: true });
});

app.use("/register", RegisterRouter);
app.use("/login", LoginRouter);
app.use("/students", studentsRouter);

app.get(/.*/, (_request, response) => {
    response.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});