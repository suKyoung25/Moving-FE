import { jwtVerify } from "jose";

// locale prefix 제거
export function removeLocalePrefix(pathname: string) {
   const segments = pathname.split("/");
   return ["ko", "en", "zh"].includes(segments[1])
      ? "/" + segments.slice(2).join("/")
      : pathname;
}

// 경로 매칭
export function matchPath(path: string, routeList: string[]) {
   return routeList.some(
      (route) =>
         path === route ||
         path.startsWith(route + "/") ||
         path.startsWith(route + "?"),
   );
}

// JWT 디코딩
export async function decodeJWT(token: string) {
   const secret = new TextEncoder().encode(process.env.JWT_SECRET);
   const { payload } = await jwtVerify(token, secret);
   return payload as {
      userType: "client" | "mover";
      isProfileCompleted: boolean;
   };
}
