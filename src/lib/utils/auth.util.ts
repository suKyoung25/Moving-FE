import { BASE_URL } from "../api/fetch-client";

// ✅ 토큰 설정
export const accessTokenSettings = {
   // ★ 개발자 도구 - "쿠키"에 토큰 넣음
   set: (accessToken: string) => {
      if (typeof window != "undefined") {
         try {
            const token = JSON.parse(atob(accessToken.split(".")[1])); // 토큰 본문만 가져옴
            const expiresIn = token.exp - Math.floor(Date.now() / 1000); // 만료 시간

            // 쿠키 설정
            const isSecure = location.protocol === "https:"; // https 환경 설정
            document.cookie = `accessToken=${accessToken}; path=/; max-age=${expiresIn}; SameSite=lax${isSecure ? "; Secure" : ""}`;
         } catch (error) {
            console.error("토큰 설정 오류(set): ", error);
         }
      }
   },

   // ★ 토큰을 가져옴
   get: () => {
      // 로그인한 상태면 토큰 가져옴
      if (typeof window !== "undefined") {
         try {
            const cookies = document.cookie.split("; "); // 쿠키 중에서
            const token = cookies.find((row) =>
               row.trim().startsWith("accessToken="),
            ); // accessToken 고르고

            return token && token.split("=")[1]; // 가져옴
         } catch (error) {
            console.error("토큰 설정 오류(get): ", error);
         }
      }

      return null; // 로그인 안 했으면 토큰 안 가져옴
   },

   // ★ 토큰을 제거함
   clear: () => {
      if (typeof window !== "undefined") {
         document.cookie = "accessToken=; path=/; max-age=0; SameSite=lax"; // 만료시간 0으로 만들고 토큰 정보 삭제
      }
   },

   // ★ 토큰을 재생성함
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
         accessTokenSettings.set(refreshData.accessToken);
         return refreshData.accessToken;
      } catch (error) {
         accessTokenSettings.clear();

         if (error instanceof Error)
            throw new Error(
               `토큰 갱신 중 오류가 발생했습니다: ${error.message}`,
            );

         throw new Error("토큰 갱신 중 알 수 없는 오류 발생");
      }
   },
};
