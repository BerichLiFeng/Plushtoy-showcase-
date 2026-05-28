import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/json-db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = getAll<any>("blog");
  const item = data.find(
    (d) => d.slug === slug && d.is_active !== false
  );
  if (!item) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}