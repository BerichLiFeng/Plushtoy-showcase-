import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(request: NextRequest) {
  const client = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category_slug");

  let query = client
    .from("products")
    .select("*, product_categories!inner(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (categorySlug) {
    query = query.eq("product_categories.slug", categorySlug);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}