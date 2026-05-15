import { getSupabaseClient } from "@/storage/database/supabase-client";
import { NextResponse } from "next/server";

type ApiConfig = {
  table: string;
  fields: string[];
  searchFields?: string[];
};

function createAdminApi(config: ApiConfig) {
  const { table, fields } = config;

  return {
    async GET() {
      const client = getSupabaseClient();
      const { data, error } = await client.from(table).select("*").order("sort_order", { ascending: true });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data || []);
    },

    async POST(request: Request) {
      const body = await request.json();
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        if (body[f] !== undefined) payload[f] = body[f];
      }
      const client = getSupabaseClient();
      const { data, error } = await client.from(table).insert(payload).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    },

    async PUT(request: Request) {
      const body = await request.json();
      const { id, ...rest } = body;
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        if (rest[f] !== undefined) payload[f] = rest[f];
      }
      const client = getSupabaseClient();
      const { data, error } = await client.from(table).update(payload).eq("id", id).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    },

    async DELETE(request: Request) {
      const { id } = await request.json();
      const client = getSupabaseClient();
      const { error } = await client.from(table).delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    },
  };
}

export { createAdminApi };