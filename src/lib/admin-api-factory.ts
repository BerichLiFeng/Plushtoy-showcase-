import { getAll, getById, create, update, remove } from "@/lib/json-db";
import { NextRequest, NextResponse } from "next/server";

interface TableConfig {
  table: string;
  fields: string[];
  pk?: string;
}

export function createAdminApi(config: TableConfig) {
  const { table, fields, pk = "id" } = config;

  async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (id) {
      const item = getById(table, parseInt(id));
      return NextResponse.json(item || null);
    }
    const data = getAll(table);
    return NextResponse.json(data);
  }

  async function POST(req: NextRequest) {
    const body = await req.json();
    const { id, ...item } = body;
    if (id) {
      const updates: Record<string, unknown> = {};
      for (const field of fields) {
        if (item[field] !== undefined) updates[field] = item[field];
      }
      const result = update(table, parseInt(id), updates);
      return NextResponse.json(result || { error: "not found" }, { status: result ? 200 : 404 });
    }
    const newItem = create(table, item as any);
    return NextResponse.json(newItem, { status: 201 });
  }

  async function PUT(req: NextRequest) {
    return POST(req);
  }

  async function DELETE(req: NextRequest) {
    const body = await req.json();
    const result = remove(table, body.id);
    return NextResponse.json({ success: result });
  }

  return { GET, POST, PUT, DELETE };
}