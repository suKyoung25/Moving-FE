import { BASE_URL } from "./fetch-client";
import {
   clearServerToken,
   getServerToken,
   setServerToken,
} from "./server-token.util";

// 종합 토큰 설정
export const tokenSettings = {
   // ✅ 개발자 도구 - "쿠키"에 토큰 넣음
   set: (accessToken: string) => {
      // ★ 서버 환경일 때
      if (typeof window === "undefined") {
         return setServerToken(accessToken);
      }

      // ★ 브라우저 환경일 때
      const token = JSON.parse(atob(accessToken.split(".")[1]));

      // 만료 시간 설정
      const accessTokenExpiresIn = token.exp - Math.floor(Date.now() / 1000);

      // 쿠키 설정
      const isSecure = location.protocol === "https:"; // https 환경 설정
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${accessTokenExpiresIn}; SameSite=lax${isSecure ? "; Secure" : ""}`;
   },

   // ✅ 로그인한 상태면 토큰을 가져옴
   get: (cookieName = "accessToken") => {
      // ★ 서버 환경일 때
      if (typeof window === "undefined") {
         return getServerToken(cookieName);
      }

      // ★ 브라우저 환경일 때
      if (typeof window !== "undefined") {
         const cookies = document.cookie.split("; "); // 쿠키 중에서
         const token = cookies.find((cookie) =>
            cookie.startsWith("accessToken="),
         ); // accessToken 고르고

         return token && token.trim().split("=")[1]; // 가져옴
      }

      // ★ 로그인 안 했으면 토큰 안 가져옴
      return null;
   },

   // ✅ 토큰을 제거함
   clear: async () => {
      // ★ 서버 환경일 때
      if (typeof window === "undefined") {
         return await clearServerToken();
      }

      // ★ 브라우저 환경일 때
      document.cookie = "accessToken=; path=/; max-age=0; SameSite=lax"; // 만료시간 0으로 만들고 토큰 정보 삭제
   },

   // ✅ 토큰을 재생성함
   refresh: async () => {
      try {
         // 백엔드에서 refreshToken api 호출
         const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: {},
         });

         const responseText = await response.text();
         const refreshData = JSON.parse(responseText);

         // !response.ok 상황 나열
         if (!response.ok) {
            throw new Error(`[${response.status}] 오류: ${responseText}`);
         }

         if (!responseText) {
            throw new Error("토큰 갱신 응답 메시지가 없습니다.");
         }

         if (!refreshData || !refreshData.accessToken) {
            throw new Error("갱신된 응답에 accessToken이 없습니다.");
         }

         // OK
         tokenSettings.set(refreshData.accessToken);
         return refreshData.accessToken;
      } catch (error) {
         tokenSettings.clear();

         if (error instanceof Error)
            throw new Error(`토큰 갱신 중 오류 발생: ${error.message}`);
      }
   },
};
