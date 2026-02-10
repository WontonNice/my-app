import { useState } from "react";
import type { FormEvent } from "react";

const MAX_ERROR_DETAILS = 3;

type AuthMode = "login" | "register";

function getApiBases() {
    const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim();
    if (configuredBase) {
        return [configuredBase];
    }

    const host = window.location.hostname;
    const normalizedHost = host === "0.0.0.0" ? "localhost" : host;

    return [
        `${window.location.protocol}//${normalizedHost}:8080`,
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ];
}

const API_BASES = [...new Set(getApiBases())];

async function parseResponseBody(response: Response) {
    const responseText = await response.text();

    if (!responseText) {
        return null;
    }

    try {
        return JSON.parse(responseText) as Record<string, unknown>;
    } catch {
        return { raw: responseText } as Record<string, unknown>;
    }
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

function HomePage() {
    const [mode, setMode] = useState<AuthMode>("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isRegister = mode === "register";

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        setIsLoading(true);

        const endpoint = isRegister ? "/register" : "/login";
        const payload = isRegister
            ? { username, password, firstName, lastName }
            : { username, password };

        const attemptErrors: string[] = [];

        try {
            for (const apiBase of API_BASES) {
                const requestUrl = `${apiBase}${endpoint}`;

                try {
                    const response = await fetch(requestUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });

                    const result = await parseResponseBody(response);

                    if (!response.ok) {
                        const serverError =
                            (typeof result?.error === "string" && result.error) ||
                            (typeof result?.message === "string" && result.message) ||
                            `HTTP ${response.status}`;

                        const diagnostic = `${requestUrl} -> ${serverError}`;
                        attemptErrors.push(diagnostic);
                        console.error("Auth request failed:", diagnostic, result);

                        continue;
                    }

                    setMessage(
                        isRegister ? "Registration successful!" : "Login successful!"
                    );
                    return;
                } catch (error) {
                    const diagnostic = `${requestUrl} -> ${getErrorMessage(error)}`;
                    attemptErrors.push(diagnostic);
                    console.error("Auth request threw:", diagnostic, error);
                }
            }

            const compactDiagnostics = attemptErrors.slice(0, MAX_ERROR_DETAILS).join(" | ");
            const extraCount = Math.max(attemptErrors.length - MAX_ERROR_DETAILS, 0);
            const extraSuffix = extraCount > 0 ? ` (+${extraCount} more)` : "";

            setMessage(
                `Could not reach backend on port 8080. ${compactDiagnostics}${extraSuffix}`
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <section
                style={{
                    width: "100%",
                    maxWidth: 420,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 24,
                }}
            >
                <h1 style={{ marginTop: 0 }}>
                    {isRegister ? "Create Account" : "Login"}
                </h1>

                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <button type="button" onClick={() => setMode("login")}>
                        Login
                    </button>
                    <button type="button" onClick={() => setMode("register")}>
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    {isRegister && (
                        <>
                            <input
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                required
                            />
                        </>
                    )}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Please wait..." : isRegister ? "Register" : "Login"}
                    </button>
                </form>

                {message && (
                    <p style={{ marginBottom: 0, marginTop: 14 }} aria-live="polite">
                        {message}
                    </p>
                )}
            </section>
        </main>
    );
}

export default HomePage;