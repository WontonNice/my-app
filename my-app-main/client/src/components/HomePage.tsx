import { useState } from "react";
import type { FormEvent } from "react";
import type { AuthUser } from "../authStorage";

type AuthMode = "login" | "register";

type HomePageProps = {
    onLoginSuccess: (user: AuthUser) => void;
};

const API_BASE =
    import.meta.env.VITE_API_BASE_URL?.trim() || "";

async function parseResponseBody(response: Response) {
    const responseText = await response.text();
    if (!responseText) return null;

    try {
        return JSON.parse(responseText) as Record<string, unknown>;
    } catch {
        return { raw: responseText } as Record<string, unknown>;
    }
}

function getErrorMessage(error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
        return "Request timed out. Please try again.";
    }

    return error instanceof Error ? error.message : String(error);
}

function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 15000) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);

    return fetch(url, { ...init, signal: controller.signal }).finally(() => {
        window.clearTimeout(timer);
    });
}

function parseEnrolledCourses(value: unknown): string[] {
    if (!Array.isArray(value)) return [];

    return value
        .filter((course): course is string => typeof course === "string")
        .map((course) => course.trim())
        .filter(Boolean);
}

function getUserFromResult(result: Record<string, unknown> | null): AuthUser {
    const data =
        typeof result?.data === "object" && result.data ? result.data : result;

    const roleValue =
        data && "role" in data && typeof data.role === "string"
            ? data.role
            : "student";

    const normalizedRole = roleValue.trim().toLowerCase() === "teacher" ? "teacher" : "student";

    const username =
        data && "username" in data && typeof data.username === "string"
            ? data.username
            : "";

    const firstName =
        data && "first_name" in data && typeof data.first_name === "string"
            ? data.first_name
            : null;

    const lastName =
        data && "last_name" in data && typeof data.last_name === "string"
            ? data.last_name
            : null;

    const enrolledCourses =
        data && "enrolled_courses" in data
            ? parseEnrolledCourses(data.enrolled_courses)
            : [];

    return {
        role: normalizedRole,
        username,
        firstName,
        lastName,
        enrolledCourses,
    };
}

function HomePage({ onLoginSuccess }: HomePageProps) {
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

        const requestUrl = `${API_BASE}${endpoint}`;

        try {
            const response = await fetchWithTimeout(
                requestUrl,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                },
                15000
            );

            const result = await parseResponseBody(response);

            if (!response.ok) {
                const serverError =
                    (typeof result?.error === "string" && result.error) ||
                    (typeof result?.message === "string" && result.message) ||
                    (result?.raw && typeof result.raw === "string" && result.raw) ||
                    `HTTP ${response.status}`;

                setMessage(`${serverError}`);
                return;
            }

            if (isRegister) {
                setMode("login");
                setUsername("");
                setPassword("");
                setFirstName("");
                setLastName("");
                setMessage("Registration successful! Please log in.");
                return;
            }

            const userFromResponse = getUserFromResult(result);
            onLoginSuccess(userFromResponse);
        } catch (error) {
            setMessage(
                `Could not reach backend at ${API_BASE}. ${getErrorMessage(error)}`
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