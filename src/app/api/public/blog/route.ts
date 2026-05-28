import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/json-db";

export async function GET() {
  const data = getAll<any>("blog")
    .filter((item) => item.is_active !== false)
    .sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0));
  return NextResponse.json(data);
}