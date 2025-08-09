import { Notification } from "@/lib/types";
import { tokenSettings } from "@/lib/utils";
import { EventSourcePolyfill } from "event-source-polyfill";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// SSE 실시간 연결 (자동 재연결 포함)
export function connectSSE(
   onMessage: (data: Notification) => void,
): EventSourcePolyfill | null {
   const accessToken = tokenSettings.get("accessToken");
   if (!accessToken) {
      console.warn("accessToken 없음. SSE 연결 생략");
      return null;
   }

   const es = new EventSourcePolyfill(`${BASE_URL}/notifications/stream`, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
      heartbeatTimeout: 60000,
   });

   es.onmessage = (event) => {
      try {
         const data = JSON.parse(event.data);
         onMessage(data);
      } catch (e) {
         console.error("SSE 데이터 파싱 오류", e, event.data);
      }
   };

   es.onerror = (err) => {
      console.error("SSE 연결 오류", err);
   };

   return es;
}
