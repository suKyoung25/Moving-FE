import { tokenFetch } from "@/lib/utils/fetch-client";

/**
 * 기사님에게 달린 리뷰 목록을 조회합니다.
 */
export async function getMoverReviews(page = 1, limit = 6) {
  return await tokenFetch(`/reviews/mover?page=${page}&limit=${limit}`, {
    method: "GET",
  });
}