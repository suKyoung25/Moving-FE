import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// next-intl locale 처리 미들웨어
const intlMiddleware = createIntlMiddleware(routing);

// const LOCALE_PREFIXES = ["ko", "en", "zh"];
// const PROFILE_CREATE_PATH = "/profile/create";

// const guestPaths = ["/", "/sign-in/client", "/sign-in/mover", "/sign-up"];
// const protectedPaths = [
//    "/dashboard",
//    "/favorite-movers",
//    "/my-quotes",
//    "/profile",
//    "/received-requests",
//    "/request",
//    "/reviews",
// ];

// locale prefix 제거 함수
// function removeLocalePrefix(pathname: string) {
//    const segments = pathname.split("/");
//    return LOCALE_PREFIXES.includes(segments[1])
//       ? "/" + segments.slice(2).join("/")
//       : pathname;
// }

// JWT 디코딩
async function decodeJWT(token: string) {
   const secret = new TextEncoder().encode(process.env.JWT_SECRET);
   const { payload } = await jwtVerify(token, secret);
   return payload;
}

export async function middleware(req: NextRequest) {
   // intl 미들웨어 적용
   const intlRespone = intlMiddleware(req);
   if (
      intlRespone instanceof NextResponse &&
      intlRespone.headers.get("x-next-intl-redirect")
   ) {
      return intlRespone;
   }

   // locale 적용된 url 기준으로 검사
   // const path = removeLocalePrefix(req.nextUrl.pathname);
   const token = req.cookies.get("accessToken")?.value;

   // const isGuestRoute = guestPaths.some(
   //    (route) => path === route || path.startsWith(route + "/"),
   // );
   // const isProtectedRoute = protectedPaths.some(
   //    (route) =>
   //       path === route ||
   //       path.startsWith(route + "/") ||
   //       path.startsWith(route + "?"),
   // );

   // // 인증되지 않은 사용자가 ProtectedRoute 접근 시 로그인 페이지로 리디렉션
   // if (!token && isProtectedRoute) {
   //    return NextResponse.redirect(new URL("/sign-in/client", req.url));
   // }

   if (!token) return intlRespone;
   const decoded = await decodeJWT(token);
   // const isAuthenticated = !!token;
   console.log(decoded);

   // // 프로필 미완료인데 다른 페이지 접근 시
   // if (
   //    isAuthenticated &&
   //    !decoded.isProfileCompleted &&
   //    path !== PROFILE_CREATE_PATH &&
   //    !path.startsWith(PROFILE_CREATE_PATH + "/")
   // ) {
   //    return NextResponse.redirect(new URL(PROFILE_CREATE_PATH, req.url));
   // }

   // // 프로필 완료인데 /profile/create 접근 시
   // if (
   //    isAuthenticated &&
   //    decoded.isProfileCompleted &&
   //    (path === PROFILE_CREATE_PATH ||
   //       path.startsWith(PROFILE_CREATE_PATH + "/"))
   // ) {
   //    return NextResponse.redirect(new URL("/mover-search", req.url));
   // }

   // // 인증된 사용자가 GuestRoute 접근 시 기사님 찾기 페이지로 리디렉션
   // if (isAuthenticated && isGuestRoute) {
   //    return NextResponse.redirect(new URL("/mover-search", req.url));
   // }

   // intl 처리된 response 이어서 전달
   return intlRespone;
}

export const config = {
   matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
