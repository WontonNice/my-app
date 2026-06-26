import { Router } from "express";
import { findClassroomByCode, getPublicClassrooms } from "../config/classes";
import { classIdsKey, getAuthenticatedUser, getEnrolledClassIds } from "../lib/auth";
import { supabase } from "../lib/supabase";

type JoinClassBody = {
    code?: unknown;
};

export const classesRouter = Router();

classesRouter.get("/mine", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);

    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    const classIds = getEnrolledClassIds(user.app_metadata);

    response.json({ classes: getPublicClassrooms(classIds) });
});

classesRouter.post("/join", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);

    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    const body = request.body as JoinClassBody;
    const code = typeof body.code === "string" ? body.code : "";
    const classroom = findClassroomByCode(code);

    if (!classroom) {
        response.status(404).json({ message: "That classroom code does not match an active class." });
        return;
    }

    const currentClassIds = getEnrolledClassIds(user.app_metadata);
    const nextClassIds = Array.from(new Set([...currentClassIds, classroom.id]));

    if (!currentClassIds.includes(classroom.id)) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            app_metadata: {
                ...user.app_metadata,
                [classIdsKey]: nextClassIds,
            },
        });

        if (updateError) {
            response.status(400).json({ message: updateError.message });
            return;
        }
    }

    response.json({
        classes: getPublicClassrooms(nextClassIds),
        joinedClass: getPublicClassrooms([classroom.id])[0],
    });
});
