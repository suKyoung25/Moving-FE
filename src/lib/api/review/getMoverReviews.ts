import { tokenFetch, defaultFetch } from "@/lib/utils/fetch-client";

/**
 * 기사님에게 달린 리뷰 목록을 조회합니다.
 * @param page 페이지 번호
 * @param limit 페이지당 개수
 * @param moverId 특정 기사의 리뷰를 조회할 때 사용 (선택적)
 */
export async function getMoverReviews(page = 1, limit = 6, moverId?: string) {
  console.log('🔍 getMoverReviews called with:', { page, limit, moverId });
  
  let endpoint: string;
  let fetchFunction: typeof tokenFetch | typeof defaultFetch;
  
  if (moverId) {
    // 특정 기사의 리뷰 조회 (공개 API - 인증 불필요)
    endpoint = `/reviews/mover/${moverId}?page=${page}&limit=${limit}`;
    fetchFunction = defaultFetch;
    console.log('🔍 Using PUBLIC API for specific mover');
  } else {
    // 본인의 리뷰 조회 (인증 API - 인증 필요)
    endpoint = `/reviews/mover?page=${page}&limit=${limit}`;
    fetchFunction = tokenFetch;
    console.log('🔍 Using AUTHENTICATED API for own reviews');
  }
  
  console.log('🔍 API endpoint:', endpoint);
  
  try {
    const result = await fetchFunction(endpoint, {
      method: "GET",
    });
    
    console.log('🔍 API response:', result);
    return result;
  } catch (error) {
    console.error('🔍 API error:', error);
    throw error;
  }
}