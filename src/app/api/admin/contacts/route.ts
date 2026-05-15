import { getSupabaseClient } from "@/storage/database/supabase-client";
import { NextResponse } from "next/server";

export async function GET() {
  const client = getSupabaseClient();
  const { data } = await client.from("contacts").select("*").limit(1);
  return NextResponse.json(data?.[0] || null);
}

export async function POST(request: Request) {
  const body = await request.json();
  const client = getSupabaseClient();
  const { data: existing } = await client.from("contacts").select("id").limit(1);
  if (existing?.length) {
    const { data } = await client.from("contacts").update(body).eq("id", existing[0].id).select().single();
    return NextResponse.json(data);
  }
  const { data } = await client.from("contacts").insert(body).select().single();
  return NextResponse.json(data);
}