import { createAdminApi } from "@/lib/admin-api-factory";
const api = createAdminApi({ table: "products", fields: ["category_id", "name", "description", "price", "image_keys", "is_active", "sort_order"] });
export const GET = api.GET; export const POST = api.POST; export const PUT = api.PUT; export const DELETE = api.DELETE;
