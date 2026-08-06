import { Router } from "express";
import { findClassroomByCode, getPublicClassrooms } from "../config/classes";
import { classIdsKey, classJoinRequestsKey, getAuthenticatedUser, getClassJoinRequests, getEnrolledClassIds, getUserRole } from "../lib/auth";
import { supabase } from "../lib/supabase";

type JoinClassBody = {
    code?: unknown;
};

type ReviewClassRequestBody = {
    action?: unknown;
};

export const classesRouter = Router();

classesRouter.get("/mine", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);

    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    const authoritativeResult = await supabase.auth.admin.getUserById(user.id);
    const currentUser = authoritativeResult.data.user ?? user;
    const classIds = getEnrolledClassIds(currentUser.app_metadata);
    const pendingRequests = getClassJoinRequests(currentUser.app_metadata).flatMap((joinRequest) => {
        const classroom = getPublicClassrooms([joinRequest.classId])[0];
        return classroom ? [{ ...joinRequest, classroom, status: "pending" as const }] : [];
    });

    response.json({ classes: getPublicClassrooms(classIds), pendingRequests });
});

classesRouter.post("/join", async (request, response) => {
    const { error, user } = await getAuthenticatedUser(request.headers.authorization);

    if (error || !user) {
        response.status(401).json({ message: error });
        return;
    }

    const authoritativeResult = await supabase.auth.admin.getUserById(user.id);
    const currentUser = authoritativeResult.data.user ?? user;

    if (getUserRole(currentUser) !== "student") {
        response.status(403).json({ message: "Only student accounts can request class access." });
        return;
    }

    const body = request.body as JoinClassBody;
    const code = typeof body.code === "string" ? body.code : "";
    const classroom = findClassroomByCode(code);

    if (!classroom) {
        response.status(404).json({ message: "That classroom code does not match an active class." });
        return;
    }

    const currentClassIds = getEnrolledClassIds(currentUser.app_metadata);
    if (currentClassIds.includes(classroom.id)) {
        response.json({
            classes: getPublicClassrooms(currentClassIds),
            joinedClass: getPublicClassrooms([classroom.id])[0],
            status: "approved",
        });
        return;
    }

    const currentRequests = getClassJoinRequests(currentUser.app_metadata);
    const existingRequest = currentRequests.find((request) => request.classId === classroom.id);
    const joinRequest = existingRequest ?? { classId: classroom.id, requestedAt: new Date().toISOString() };

    if (!existingRequest) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(currentUser.id, {
            app_metadata: {
                ...currentUser.app_metadata,
                [classJoinRequestsKey]: [...currentRequests, joinRequest],
            },
        });

        if (updateError) {
            response.status(400).json({ message: updateError.message });
            return;
        }
    }

    response.status(existingRequest ? 200 : 202).json({
        classes: getPublicClassrooms(currentClassIds),
        request: { ...joinRequest, classroom: getPublicClassrooms([classroom.id])[0], status: "pending" },
        status: "pending",
    });
});

classesRouter.get("/requests", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "teacher" && role !== "admin") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    const listed = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listed.error) {
        response.status(400).json({ message: listed.error.message });
        return;
    }

    const requests = listed.data.users
        .filter((candidate) => getUserRole(candidate) === "student")
        .flatMap((student) => getClassJoinRequests(student.app_metadata).flatMap((joinRequest) => {
            const classroom = getPublicClassrooms([joinRequest.classId])[0];
            if (!classroom) return [];
            const fallbackName = student.email?.split("@")[0] ?? "Student";
            return [{
                classroom,
                requestedAt: joinRequest.requestedAt,
                studentEmail: student.email ?? "",
                studentId: student.id,
                studentName: typeof student.user_metadata.full_name === "string" ? student.user_metadata.full_name : fallbackName,
                studentUsername: typeof student.user_metadata.username === "string" ? student.user_metadata.username : fallbackName,
            }];
        }))
        .sort((left, right) => left.requestedAt.localeCompare(right.requestedAt));

    response.json({ requests });
});

classesRouter.patch("/requests/:studentId/:classId", async (request, response) => {
    const authenticated = await getAuthenticatedUser(request.headers.authorization);
    if (authenticated.error || !authenticated.user) {
        response.status(401).json({ message: authenticated.error });
        return;
    }
    const role = getUserRole(authenticated.user);
    if (role !== "teacher" && role !== "admin") {
        response.status(403).json({ message: "Teacher access is required." });
        return;
    }

    const body = request.body as ReviewClassRequestBody;
    const action = body.action === "approve" || body.action === "reject" ? body.action : null;
    if (!action) {
        response.status(400).json({ message: "Choose approve or reject." });
        return;
    }

    const targetResult = await supabase.auth.admin.getUserById(request.params.studentId);
    const student = targetResult.data.user;
    if (targetResult.error || !student || getUserRole(student) !== "student") {
        response.status(404).json({ message: "Student account was not found." });
        return;
    }

    const classroom = getPublicClassrooms([request.params.classId])[0];
    const currentRequests = getClassJoinRequests(student.app_metadata);
    const pendingRequest = currentRequests.find((candidate) => candidate.classId === request.params.classId);
    if (!classroom || !pendingRequest) {
        response.status(404).json({ message: "This class request is no longer pending." });
        return;
    }

    const nextClassIds = action === "approve"
        ? Array.from(new Set([...getEnrolledClassIds(student.app_metadata), request.params.classId]))
        : getEnrolledClassIds(student.app_metadata);
    const updated = await supabase.auth.admin.updateUserById(student.id, {
        app_metadata: {
            ...student.app_metadata,
            [classIdsKey]: nextClassIds,
            [classJoinRequestsKey]: currentRequests.filter((candidate) => candidate.classId !== request.params.classId),
        },
    });
    if (updated.error) {
        response.status(400).json({ message: updated.error.message });
        return;
    }

    response.json({ action, classroom, studentId: student.id });
});
