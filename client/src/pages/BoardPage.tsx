import { useEffect, useState } from "react";
import { getActiveSession } from "../lib/sessionCache";
import { boardApi } from "../features/boards/api";
import { BoardSession } from "../features/boards/session";
import { BoardCanvas } from "../features/boards/BoardCanvas";

export function BoardPage() {
  const [session, setSession] = useState<BoardSession | null>(null), [token, setToken] = useState(""), [error, setError] = useState("");
  const boardId = window.location.pathname.split("/")[2];
  const requestedReturn = new URLSearchParams(window.location.search).get("returnTo") || "";
  const returnHref = /^\/(teacher(?:[/?]|$)|study-hall\/shsat(?:[/?]|$))/.test(requestedReturn) ? requestedReturn : "/study-hall/shsat/boards";
  useEffect(() => {
    let active = true, connection: BoardSession | undefined;
    void getActiveSession().then(async auth => {
      if (!auth) { window.location.assign("/login"); return; }
      const access = await boardApi(auth.access_token).get(boardId);
      if (!active) return;
      connection = new BoardSession(access.board, access.canManage, auth.user.id);
      setToken(auth.access_token); setSession(connection);
      await connection.start();
    }).catch(error => { if (active) setError(error instanceof Error ? error.message : "Could not open board."); });
    return () => { active = false; connection?.stop(); };
  }, [boardId]);
  if (error) return <main className="board-page-error"><h1>Could not open this board</h1><p role="alert">{error}</p><a href={returnHref}>Return to student workspace</a><button onClick={() => window.location.reload()}>Try again</button></main>;
  if (!session) return <main className="loading-shell">Opening your shared notebook…</main>;
  return <BoardCanvas session={session} token={token} returnHref={returnHref} />;
}
