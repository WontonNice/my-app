import { useEffect, useState } from "react";
import { getStudentClasses } from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  cacheStudentClasses,
  getActiveSession,
  getCachedStudentClasses,
  peekActiveSession,
} from "../lib/sessionCache";
import { getStudentPreviewContext } from "../lib/studentPreview";

export function useStudentPortalAccess(classId = "shsat") {
  const previewContext = getStudentPreviewContext();
  const initialSession = peekActiveSession();
  const initialMetadata = initialSession?.user.user_metadata as
    | { full_name?: string; name?: string }
    | undefined;
  const initialClasses = initialSession
    ? getCachedStudentClasses(initialSession.user.id) ?? []
    : [];
  const [accessToken, setAccessToken] = useState(initialSession?.access_token ?? "");
  const [hasMultipleClasses, setHasMultipleClasses] = useState(initialClasses.length > 1);
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
          setHasMultipleClasses(false);
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        const studentClasses =
          getCachedStudentClasses(session.user.id) ??
          (await getStudentClasses(session.access_token));
        cacheStudentClasses(session.user.id, studentClasses);

        if (!studentClasses.some((studentClass) => studentClass.id === classId)) {
          window.location.assign("/dashboard");
          return;
        }

        if (isMounted) setHasMultipleClasses(studentClasses.length > 1);
      } catch {
        window.location.assign("/dashboard");
        return;
      }

      if (isMounted) setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, [classId, previewContext.isPreview, previewContext.studentName]);

  return {
    accessToken,
    hasMultipleClasses,
    isCheckingSession,
    isSupabaseConfigured,
    previewContext,
    studentName,
  };
}
