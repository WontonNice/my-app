// Only bundled by preview-boards.cjs. No production import or auth changes.
const requestedRole = new URLSearchParams(location.search).get("as") || sessionStorage.getItem("board-qa-role");
const role = requestedRole === "student" ? "student" : "teacher";
sessionStorage.setItem("board-qa-role", role);
const user = { id: role === "teacher" ? "33333333-3333-4333-8333-333333333333" : "11111111-1111-4111-8111-111111111111", app_metadata: { role, class_ids: ["shsat"] }, user_metadata: { full_name: role === "teacher" ? "QA Teacher" : "QA Student" } };
const session = { access_token: role, user };
export const isSupabaseConfigured = true;
export const getSupabaseClient = () => ({ auth: { getSession: async () => ({ data: { session } }), refreshSession: async () => ({ data: { session }, error: null }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) } });
