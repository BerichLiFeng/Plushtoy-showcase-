import { NextRequest, NextResponse } from "next/server";
import { getAll, getById, create, update, remove } from "@/lib/json-db";

const TABLE = "blog";
const FIELDS = ["title", "slug", "excerpt", "content", "author", "image_key", "category", "published_at", "is_active", "sort_order"];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const item = getById(TABLE, parseInt(id));
    return NextResponse.json(item || null);
  }
  const data = getAll(TABLE);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, ...item } = body;
  if (id) {
    const updates: Record<string, unknown> = {};
    for (const field of FIELDS) {
      if (item[field] !== undefined) updates[field] = item[field];
    }
    const result = update(TABLE, parseInt(id), updates);
    return NextResponse.json(result || { error: "not found" }, { status: result ? 200 : 404 });
  }
  const newItem = create(TABLE, item as any);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const result = remove(TABLE, body.id);
  return NextResponse.json({ success: result });
}