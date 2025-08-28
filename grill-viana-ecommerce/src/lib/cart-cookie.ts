import { NextResponse } from "next/server";

export function setCartCookie(res: NextResponse, cartId: string | null) {
  if (!cartId) {
    res.cookies.set("cartId", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return;
  }
  res.cookies.set("cartId", cartId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });
}