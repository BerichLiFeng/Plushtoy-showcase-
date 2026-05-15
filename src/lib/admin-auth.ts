"use server";

import { cookies } from "next/headers";

const ADMIN_PASSWORD = "dreamdoll888";

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === ADMIN_PASSWORD;
}

export async function setAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set("admin_token", ADMIN_PASSWORD, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}