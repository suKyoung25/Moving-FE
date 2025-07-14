/**
 * 사용법:
 *
 * - defaultFetch와 cookieFetch 중 택1
 * - defaultFetch("/경로", 옵션인데 안 써도 됨)
 * - cookieFetch("/경로", 옵션인데 안 써도 됨22)
 */

import { accessTokenSettings } from "../utils/auth.util";
import isFetchError from "../utils/fetch-error.util";

// ✅ 기본 url : 두 개를 바꿔 가면서 쓰세요.
export const BASE_URL = "https://www.moving-web.site"; // "http://localhost:4000";

// ✅ with-guest, with-public 경로에서 쓰는 미로그인 전용 fetch
export async function defaultFetch(
   endpoint: string,
   options: RequestInit = {},
) {
   // ★ 기본 정보
   const url = `${BASE_URL}${endpoint}`; // 1. 주소
   let body = options.body; // 2. 요청 본문 (서버에 보내는 payload)

   // 3. 요청 헤더: body가 FormData면 Content-Type: application/json 삭제
   const headers = {
      ...options.headers,
      ...(body instanceof FormData
         ? {}
         : { "Content-Type": "application/json" }),
   };

   // ★ body 변환 : 객체면 body를 json 변환 (GET 제외)
   const ifConditions =
      body &&
      typeof body === "object" &&
      !(body instanceof FormData) &&
      ["POST", "PUT", "PATCH"].includes(options.method?.toUpperCase() ?? "");

   if (ifConditions) {
      body = JSON.stringify(body);
   } // FormData는 위에서 경우의 수 지웠고 문자열 등이면 자료 형태 그대로 둠

   // ★ 응답
   try {
      const response = await fetch(url, { ...options, headers, body });
      if (!response.ok) {
         const errorBody = await response.json();
         throw { status: response.status, body: errorBody };
      }

      return response.json();
   } catch (error: unknown) {
      console.error("defaultFetch Error: ", error);

      if (isFetchError(error)) throw error;

      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
   }
}

// ✅ with-protect 경로에서 쓰는 fetch
export async function tokenFetch(
   endpoint: string,
   options: RequestInit = {},
   onAuthFail?: () => void, // refreshToken 못 받아오면 진행 날림
) {
   // ★ 기본 정보
   const url = `${BASE_URL}${endpoint}`; // 1. 주소
   let body = options.body; // 2. 본문

   // 3. accessToken
   let accessToken = accessTokenSettings.get();
   if (!accessToken) {
      console.warn("accessToken 없음: 로그인 필요");
      onAuthFail?.();
      throw new Error("로그인 정보가 없습니다. 다시 로그인해 주세요.");
   }

   // 4. headers
   const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      ...(body instanceof FormData
         ? {}
         : { "Content-Type": "application/json" }),
   };

   // ★ body 변환 : 객체랑 GET 제외22
   const ifConditions =
      body &&
      typeof body === "object" &&
      !(body instanceof FormData) &&
      ["POST", "PUT", "PATCH"].includes(options.method?.toUpperCase() ?? "");

   if (ifConditions) {
      body = JSON.stringify(body);
   }

   // ★ 요청
   let response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
      body,
   });

   // 401 오류면 토큰 재발급 시도
   if (response.status === 401) {
      try {
         accessToken = await accessTokenSettings.refresh();
         headers.Authorization = `Bearer ${accessToken}`;

         response = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
            body,
         });
      } catch (error) {
         console.error("토큰 갱신 실패:", error);
         accessTokenSettings.clear();
         onAuthFail?.();
         throw new Error("토큰 갱신에 실패했습니다. 재로그인을 시도해 주세요.");
      }
   }

   if (response.status === 204) return null;

   // !response.ok + 반환
   try {
      if (!response.ok) {
         const errorBody = await response.json();
         throw { status: response.status, body: errorBody };
      }

      return response.json();
   } catch (error: unknown) {
      console.error("token Fetch Error: ", error);

      if (isFetchError(error)) throw error;

      throw new Error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
   }
}
