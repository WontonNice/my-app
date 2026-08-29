import { useEffect, useState } from "react";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { isSupabaseConfigured } from "../lib/supabase";
import { getActiveSession, peekActiveSession } from "../lib/sessionCache";
import { getStudentPreviewContext } from "../lib/studentPreview";

export function useStudentPortalAccess() {
  const previewContext = getStudentPreviewContext();
  const initialSession = peekActiveSession();
  const initialMetadata = initialSession?.user.user_metadata as
    | { full_name?: string; name?: string }
    | undefined;
  const [accessToken, setAccessToken] = useState(initialSession?.access_token ?? "");
  const [isCheckingSession, setIsCheckingSession] = useState(
    isSupabaseConfigured && !initialSession,
  );
  const [studentName, setStudentName] = useState(
    previewContext.studentName ||
      initialMetadata?.full_name ||
      initialMetadata?.name ||
      initialSession?.user.email?.split("@")[0] ||
      "Student",
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    getActiveSession().then(async (session) => {
      if (!session) {
        window.location.assign("/login");
        return;
      }

      const userRole = getUserRole(session.user);
      const metadata = session.user.user_metadata as { full_name?: string; name?: string };

      if (isMounted) {
        setAccessToken(session.access_token);
        setStudentName(
          previewContext.studentName ||
            metadata.full_name ||
            metadata.name ||
            session.user.email?.split("@")[0] ||
            "Student",
        );
      }

      const canPreviewStudentPortal =
        previewContext.isPreview && (userRole === "teacher" || userRole === "admin");

      if (userRole !== "student" && !canPreviewStudentPortal) {
        window.location.assign(getDashboardPath(userRole));
        return;
      }

      if (canPreviewStudentPortal) {
        if (isMounted) {
          setIsCheckingSession(false);
        }
        return;
      }

      if (isMounted) setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, [previewContext.isPreview, previewContext.studentName]);

  return {
    accessToken,
    isCheckingSession,
    isSupabaseConfigured,
    previewContext,
    studentName,
  };
}
