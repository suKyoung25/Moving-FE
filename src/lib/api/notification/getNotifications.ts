import { Notification } from "@/lib/types";
import { tokenFetch, tokenSettings } from "@/lib/utils";
import { EventSourcePolyfill } from "event-source-polyfill";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 알림 목록 조회
export async function getNotifications() {
   return await tokenFetch("/notifications");
}

// SSE 실시간 연결
export function connectSSE(
   onMessage: (data: Notification) => void,
): EventSourcePolyfill {
   const accessToken = tokenSettings.get("accessToken");

   const es = new EventSourcePolyfill(`${BASE_URL}/notifications/stream`, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
   });

   es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
   };

   es.onerror = (err) => {
      console.error("SSE 연결 오류", err);
      es.close();
   };

   return es;
}
