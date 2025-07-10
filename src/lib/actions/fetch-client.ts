// ✅ 기본 url : 두 개를 바꿔 가면서 쓰세요.
const BASE_URL = "http://localhost:3002"; // "https://www.moving-web.site"

// ✅ with-guest, with-public 경로에서 쓰는 미로그인 fetch
export async function defaultFetch(
   endpoint: string,
   options: RequestInit = {},
) {
   // 기본 정보
   const url = `${BASE_URL}${endpoint}`;
   let body = options.body; // 요청 본문 (서버에 보내는 payload)

   const headers = {
      ...options.headers,
      ...(body instanceof FormData
         ? {}
         : { "Content-Type": "application/json" }),
   }; // 요청 헤더: body가 FormData면 Content-Type: application/json 삭제

   // ★ body 변환 : 객체면(=application/json) 정상 처리
   if (body && typeof body === "object" && !(body instanceof FormData)) {
      body = JSON.stringify(body);
   } // FormData는 위에서 경우의 수 지웠고 문자열 등이면 그대로 둠

   const res = await fetch(url, { ...options, headers, body });

   if (!res.ok) throw new Error(`defaultFetch 오류: ${res.status}`);

   return res.status === 204 ? null : res.json(); // 반환: DELETE 메소드 적용 or 본문
}
