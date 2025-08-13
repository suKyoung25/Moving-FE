import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../delay";

export { connectSSE } from "@/lib/utils/sse.util";

interface PageParms {
   cursor?: string;
   limit?: number;
}

// 알림 목록 조회
export async function getNotifications(
   { cursor, limit = 6 }: PageParms,
   targetLang?: string,
) {
   await delay(2000);
   const params = new URLSearchParams();
   if (cursor) params.append("cursor", cursor);
   params.append("limit", String(limit));

   return await tokenFetch(
      `/notifications?targetLang=${targetLang}&${params.toString()}`,
   );
}

// 알림 읽기
export async function readNotification(notificationId: string) {
   return await tokenFetch(`/notifications/${notificationId}`, {
      method: "PATCH",
   });
}

// 모든 알림 읽기
export async function readAllNotifications() {
   return await tokenFetch("/notifications", {
      method: "PATCH",
   });
}
