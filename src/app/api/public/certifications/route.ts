import { getAll } from "@/lib/json-db";
import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json(getAll("certifications")); }
