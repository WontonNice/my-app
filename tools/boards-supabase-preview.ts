// Only bundled by preview-boards.cjs. No production import or auth changes.
const requestedRole = new URLSearchParams(location.search).get("as") || sessionStorage.getItem("board-qa-role");
const role = requestedRole === "student" || requestedRole === "other" ? requestedRole : "teacher";
sessionStorage.setItem("board-qa-role", role);
const user = { id: role === "teacher" ? "33333333-3333-4333-8333-333333333333" : role === "other" ? "22222222-2222-4222-8222-222222222222" : "11111111-1111-4111-8111-111111111111", app_metadata: { role: role === "teacher" ? "teacher" : "student", class_ids: ["shsat"] }, user_metadata: { full_name: role === "teacher" ? "QA Teacher" : role === "other" ? "QA Classmate" : "QA Student" } };
const session = { access_token: role, user };
export const isSupabaseConfigured = true;
export const getSupabaseClient = () => ({ auth: { getSession: async () => ({ data: { session } }), refreshSession: async () => ({ data: { session }, error: null }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) } });
