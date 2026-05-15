import { getAll } from "@/lib/json-db";
import { NextResponse } from "next/server";
export async function GET() { const d = getAll("company"); return NextResponse.json(d[0] || null); }
