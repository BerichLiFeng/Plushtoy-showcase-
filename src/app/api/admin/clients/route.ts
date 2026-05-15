import { createAdminApi } from "@/lib/admin-api-factory";
const api = createAdminApi({ table: "clients", fields: ["name", "logo_key", "description", "sort_order", "is_active"] });
export const GET = api.GET; export const POST = api.POST; export const PUT = api.PUT; export const DELETE = api.DELETE;
