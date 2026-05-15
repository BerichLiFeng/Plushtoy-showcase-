import { createAdminApi } from "@/lib/admin-api-factory";
const api = createAdminApi({ table: "contacts", fields: ["type", "value", "label", "sort_order"] });
export const GET = api.GET; export const POST = api.POST; export const PUT = api.PUT; export const DELETE = api.DELETE;
