export const env = {
    allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    port: Number(process.env.PORT) || 8080,
};
