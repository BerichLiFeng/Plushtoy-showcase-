import { createAdminApi } from "@/lib/admin-api-factory";
const api = createAdminApi({ table: "cases", fields: ["title", "description", "client_name", "image_keys", "is_active", "sort_order"] });
export const GET = api.GET; export const POST = api.POST; export const PUT = api.PUT; export const DELETE = api.DELETE;
