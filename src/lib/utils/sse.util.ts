import { Notification } from "@/lib/types";
import { tokenSettings } from "@/lib/utils";
import { EventSourcePolyfill } from "event-source-polyfill";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// SSE 실시간 연결 (자동 재연결 포함)
export function connectSSE(
   onMessage: (data: Notification) => void,
   onOpen?: () => void,
   onError?: (error: unknown) => void,
): EventSourcePolyfill | null {
   const accessToken = tokenSettings.get("accessToken");
   if (!accessToken) {
      console.warn("accessToken 없음. SSE 연결 생략");
      return null;
   }

   const es = new EventSourcePolyfill(`${BASE_URL}/notifications/stream`, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
         "Cache-Control": "no-cache",
      },
      heartbeatTimeout: 60000,
      withCredentials: true,
   });

   es.onopen = () => {
      onOpen?.();
   };

   es.onerror = (err) => {
      onError?.(err);
      // 연결 오류 시 자동 재연결 시도
      setTimeout(() => {
         if (es.readyState === EventSource.CLOSED) {
            es.close();
         }
      }, 5000);
   };

   // notification 이벤트 처리 (실제 알림)
   es.addEventListener("notification", (event: unknown) => {
      try {
         const messageEvent = event as { data: string };
         const data = JSON.parse(messageEvent.data);
         onMessage(data);
      } catch (e) {
         console.error(
            "SSE 알림 데이터 파싱 오류",
            e,
            (event as { data: string }).data,
         );
      }
   });

   // 연결 상태 모니터링
   es.addEventListener("connected", () => {
      // 연결 확인
   });

   es.addEventListener("ping", () => {
      // ping 수신
   });

   return es;
}
