import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import RegisterRouter from "./routes/register";
import LoginRouter from "./routes/login";

const app = express();
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? '')
    .split(',')
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

app.use(cors(corsOptions));
app.use(express.json());
app.use("/register", RegisterRouter);
app.use("/login", LoginRouter);

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});