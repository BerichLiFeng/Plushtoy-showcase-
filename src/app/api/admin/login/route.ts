import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_USER = "admin";
const ADMIN_PASS = "dreamdoll888";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = Buffer.from(`${username}:${Date.now()}:${ADMIN_PASS}`).toString("base64");
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ success: false, message: "用户名或密码错误" }, { status: 401 });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const [username, , password] = decoded.split(":");
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return NextResponse.json({ authenticated: true });
    }
  } catch {}
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
  return response;
}