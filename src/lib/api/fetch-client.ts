/**
 * 사용법:
 *
 * - defaultFetch와 cookieFetch 중 택1
 * - defaultFetch("/경로", 옵션인데 안 써도 됨)
 * - cookieFetch("/경로", 옵션인데 안 써도 됨22)
 */

import { accessTokenSettings } from "../utils/auth.util";

// ✅ 기본 url : 두 개를 바꿔 가면서 쓰세요.
export const BASE_URL = "http://localhost:4000"; // "https://www.moving-web.site"

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
   const response = await fetch(url, { ...options, headers, body });
   if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`defaultFetch 오류: [${response.status}] ${errorText}`);
   }

   return response.status === 204 ? null : response.json(); // 반환: DELETE 메소드 적용 or 본문
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
      accessToken = await accessTokenSettings.refresh();
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

   // ★ 응답
   let response = await fetch(url, { ...options, headers, body });

   // accessToken 만료되면 재발급
   if (response.status === 401) {
      try {
         accessToken = await accessTokenSettings.refresh();
         headers.Authorization = `Bearer ${accessToken}`;

         response = await fetch(url, { ...options, headers, body });
      } catch (error) {
         accessTokenSettings.clear();
         onAuthFail?.();
         throw new Error(`토큰 갱신에 실패했으니 재로그인해 주세요. ${error}`);
      }
   }

   // !response.ok + 반환
   if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`tokenFetch 오류: [${response.status}] ${errorText}`);
   }

   return response.status === 204 ? null : response.json();
}
