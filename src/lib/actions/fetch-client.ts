/**
 * 사용법:
 *
 * - defaultFetch와 cookieFetch 중 택1
 * - defaultFetch("/경로", 옵션인데 안 써도 됨)
 * - cookieFetch("/경로", )
 */

import { accessTokenSettings } from "../utils/auth.util";

// ✅ 기본 url : 두 개를 바꿔 가면서 쓰세요.
export const BASE_URL = "http://localhost:3002"; // "https://www.moving-web.site"

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

   // ★ body 변환 : 객체면(=application/json) 정상 처리
   if (body && typeof body === "object" && !(body instanceof FormData)) {
      body = JSON.stringify(body);
   } // FormData는 위에서 경우의 수 지웠고 문자열 등이면 자료 형태 그대로 둠

   // ★ 응답
   let response = await fetch(url, { ...options, headers, body });
   if (!response.ok) throw new Error(`defaultFetch 오류: ${response.status}`);

   return response.status === 204 ? null : response.json(); // 반환: DELETE 메소드 적용 or 본문
}

// ✅ with-protect 경로에서 쓰는 fetch
export async function tokenFetch(endpoint: string, options: RequestInit = {}) {
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

   // ★ body 변환
   if (body && typeof body === "object" && !(body instanceof FormData)) {
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
         throw new Error("토큰 갱신에 실패습니다");
      }
   }

   // !response.ok + 반환
   if (!response.ok) throw new Error(`tokenFetch 오류: ${response.status}`);

   return response.status === 204 ? null : response.json();
}
