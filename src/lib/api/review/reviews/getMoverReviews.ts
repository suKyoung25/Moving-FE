import { tokenFetch, defaultFetch } from "@/lib/utils/fetch-client";

/**
 * 기사님에게 달린 리뷰 목록을 조회합니다.
 * @param page 페이지 번호
 * @param limit 페이지당 개수
 * @param moverId 특정 기사의 리뷰를 조회할 때 사용 (선택적)
 */
export async function getMoverReviews(
   page = 1,
   limit = 6,
   moverId?: string,
   targetLang?: string,
) {
   let endpoint: string;
   let fetchFunction: typeof tokenFetch | typeof defaultFetch;

   // 쿼리 파라미터 구성
   const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
   });

   // targetLang이 있을 때만 추가
   if (targetLang) {
      params.append("targetLang", targetLang);
   }

   if (moverId) {
      // 특정 기사의 리뷰 조회 (공개 API)
      endpoint = `/reviews/mover/${moverId}?${params.toString()}`;
      fetchFunction = defaultFetch;
   } else {
      // 본인의 리뷰 조회 (인증 API)
      endpoint = `/reviews/mover?${params.toString()}`;
      fetchFunction = tokenFetch;
   }

   try {
      const result = await fetchFunction(endpoint, {
         method: "GET",
      });

      return result;
   } catch (error) {
      throw error;
   }
}
