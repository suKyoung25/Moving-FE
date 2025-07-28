import { setServerToken } from "@/lib/utils/server-token.util";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
   const token = req.nextUrl.searchParams.get("token");
   const error = req.nextUrl.searchParams.get("error");

   if (error) {
      return NextResponse.redirect(new URL(`/sign-in?error=${error}`, req.url));
   }

   if (token) {
      await setServerToken(token); // ✅ 서버 쿠키 저장

      return NextResponse.redirect(new URL("/mover-search", req.url));
   }

   return NextResponse.redirect(new URL("/sign-in?error=no_token", req.url));
}
