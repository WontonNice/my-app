import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BoardCanvas } from "../client/src/features/boards/BoardCanvas";
import { BoardLibrary } from "../client/src/features/boards/BoardLibrary";
import { BoardSession } from "../client/src/features/boards/session";
import { boardApi } from "../client/src/features/boards/api";
import "../client/src/styles/global.css";
const params = new URLSearchParams(location.search), token = (params.get("as") || sessionStorage.getItem("board-qa-role")) === "student" ? "student" : "teacher";
function PreviewBoard({ boardId }: { boardId: string }) {
  const [session, setSession] = useState<BoardSession | null>(null), [error, setError] = useState("");
  useEffect(() => { let active = true; let current: BoardSession | undefined; void boardApi(token).get(boardId).then(async access => { if (!active) return; current = new BoardSession(access.board, access.canManage, token === "teacher" ? "33333333-3333-4333-8333-333333333333" : "11111111-1111-4111-8111-111111111111"); setSession(current); await current.start(); }).catch(error => { if (active) setError(String(error)); }); return () => { active = false; current?.stop(); }; }, [boardId]);
  if (error) return <p role="alert">{error}</p>;
  return session ? <BoardCanvas session={session} token={token} returnHref={`/?library=1&as=${token}`} /> : <p>Loading isolated board QA…</p>;
}
function Preview() {
  const [location, setLocation] = useState(window.location.pathname + window.location.search);
  useEffect(() => { const changed = () => setLocation(window.location.pathname + window.location.search); window.addEventListener("popstate", changed); return () => window.removeEventListener("popstate", changed); }, []);
  if (location.startsWith("/teacher/boards") || new URLSearchParams(location.split("?")[1]).get("library") === "1") return <main style={{ background: "#f3f5f8", minHeight: "100vh", padding: 36 }}><p>Isolated QA · fictional accounts · no real student data or Supabase writes</p><BoardLibrary accessToken={token} studentId={undefined} students={[{ id: "11111111-1111-4111-8111-111111111111", fullName: "QA Student" }]} studentName="QA Student" teacher={token === "teacher"} /></main>;
  const boardId = location.startsWith("/boards/") ? location.split("/")[2].split("?")[0] : "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  return <PreviewBoard key={boardId} boardId={boardId} />;
}
createRoot(document.getElementById("root")!).render(<Preview />);
