import { createAdminApi } from "@/lib/admin-api-factory";
const api = createAdminApi({ table: "exhibitions", fields: ["title", "description", "image_key", "date", "is_active", "sort_order"] });
export const GET = api.GET; export const POST = api.POST; export const PUT = api.PUT; export const DELETE = api.DELETE;
