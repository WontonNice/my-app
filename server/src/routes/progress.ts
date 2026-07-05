import { Router } from "express";
import type { User } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "../lib/auth";
import { supabase } from "../lib/supabase";

type LearningProgress = {
    examResults: Record<string, unknown>[];
    practice: Record<string, unknown>;
};

function getLearningProgress(user: User): LearningProgress {
    const stored = user.user_metadata.learning_progress;

    if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
        return { examResults: [], practice: {} };
    }

    const candidate = stored as Partial<LearningProgress>;
    return {
        examResults: Array.isArray(candidate.examResults) ? candidate.examResults : [],
        practice: candidate.practice && typeof candidate.practice === "object" && !Array.isArray(candidate.practice)
            ? candidate.practice
            : {},
    };
}

async function saveLearningProgress(user: User, learningProgress: LearningProgress) {
    return supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
            ...user.user_metadata,
            learning_progress: learningProgress,
        },
    });
}

export const progressRouter = Router();

progressRouter.get("/", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    response.json({ progress: getLearningProgress(user) });
});

progressRouter.put("/exam-results/:assessmentId", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    const result = request.body?.result;
    if (!result || typeof result !== "object" || Array.isArray(result)) {
        response.status(400).json({ message: "A valid exam result is required." });
        return;
    }

    const progress = getLearningProgress(user);
    const assessmentId = request.params.assessmentId;
    const examResults = [
        result as Record<string, unknown>,
        ...progress.examResults.filter((item) => item.assessmentId !== assessmentId),
    ];
    const nextProgress = { ...progress, examResults };
    const saved = await saveLearningProgress(user, nextProgress);

    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }

    response.json({ progress: nextProgress });
});

progressRouter.put("/practice/:topicSlug", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);
    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    const topicProgress = request.body?.progress;
    if (!topicProgress || typeof topicProgress !== "object" || Array.isArray(topicProgress)) {
        response.status(400).json({ message: "Valid practice progress is required." });
        return;
    }

    const progress = getLearningProgress(user);
    const nextProgress = {
        ...progress,
        practice: { ...progress.practice, [request.params.topicSlug]: topicProgress },
    };
    const saved = await saveLearningProgress(user, nextProgress);

    if (saved.error) {
        response.status(400).json({ message: saved.error.message });
        return;
    }

    response.json({ progress: nextProgress });
});
