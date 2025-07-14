import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { login, password } = await req.json();
  if (
    login === process.env.ADMIN_LOGIN &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_auth", process.env.ADMIN_PASSWORD!, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 часов
    });
    return res;
  }
  return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
} 