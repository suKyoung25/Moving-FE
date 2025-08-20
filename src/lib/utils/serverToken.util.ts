"use server";

import { cookies } from "next/headers";

// ✅ 서버 환경에서 토큰을 설정하는 함수
export async function setServerToken(accessToken: string) {
   const cookieStore = await cookies();

   // Buffer는 NodeJS에서 데이터를 저장할 수 있는 특수 객체
   // 궁금하신 분은 여기를 보세요: https://yceffort.kr/2021/10/understanding-of-nodejs-buffer
   const accessTokenData = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString(),
   );

   // 토큰 만료 시간 계산
   const accessTokenExpiresIn =
      accessTokenData.exp - Math.floor(Date.now() / 1000);

   // 쿠키 설정
   cookieStore.set("accessToken", accessToken, {
      path: "/",
      maxAge: accessTokenExpiresIn,
      sameSite: "lax",
   });
}

// ✅ 서버 환경에서 토큰을 가져오는 함수
export async function getServerToken(cookieName: string) {
   const cookieStore = await cookies(); // nextjs + 서버 환경일 때 쿠키 읽게 함
   const token = cookieStore.get(cookieName);
   return token ? token.value : null;
}

// ✅ 토큰 갱신
export async function refreshServerToken(accessToken: string) {
   const cookieStore = await cookies();

   // 토큰 설정22
   const accessTokenData = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString(),
   );

   // 토큰 만료 시간 계산22
   const accessTokenExpiresIn =
      accessTokenData.exp - Math.floor(Date.now() / 1000);

   // accessToken만 갱신
   cookieStore.set("accessToken", accessToken, {
      path: "/",
      maxAge: accessTokenExpiresIn,
      sameSite: "lax",
   });
}

// ✅ 토큰 삭제
export async function clearServerToken() {
   const cookieStore = await cookies();

   cookieStore.delete("accessToken");
   cookieStore.delete("refreshToken");

   return { success: true };
}
