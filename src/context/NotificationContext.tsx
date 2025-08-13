"use client";

import React, {
   createContext,
   ReactNode,
   useContext,
   useEffect,
   useState,
   useCallback,
   useRef,
} from "react";
import { Notification } from "@/lib/types/notification.types";
import {
   connectSSE,
   getNotifications,
} from "@/lib/api/notification/notification";
import { useAuth } from "./AuthContext";
import { useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";

interface NotificationContextValue {
   realtimeNotifications: Notification[];
   unreadCount: number | null;
   refreshUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
   null,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
   const [realtimeNotifications, setRealtimeNotifications] = useState<
      Notification[]
   >([]);
   const [unreadCount, setUnreadCount] = useState<number | null>(null);
   const { user } = useAuth();
   const locale = useLocale();
   const eventSourceRef = useRef<EventSource | null>(null);
   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const queryClient = useQueryClient();

   // unreadCount 새로고침 함수를 useCallback으로 메모이제이션
   const refreshUnreadCount = useCallback(() => {
      if (!user) return;
      getNotifications({ limit: 1 }, locale).then((res) => {
         const rawCount = res.unreadCount ?? 0;
         setUnreadCount(rawCount > 0 ? rawCount : null);
      });
   }, [user, locale]);

   // SSE 연결 해제
   const disconnectSSE = useCallback(() => {
      if (eventSourceRef.current) {
         eventSourceRef.current.close();
         eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
         clearTimeout(reconnectTimeoutRef.current);
         reconnectTimeoutRef.current = null;
      }
   }, []);

   // SSE 연결 함수
   const connectSSEConnection = useCallback(() => {
      if (!user) return;

      // 기존 연결 정리
      if (eventSourceRef.current) {
         eventSourceRef.current.close();
         eventSourceRef.current = null;
      }

      // 재연결 타임아웃 정리
      if (reconnectTimeoutRef.current) {
         clearTimeout(reconnectTimeoutRef.current);
         reconnectTimeoutRef.current = null;
      }

      const es = connectSSE(
         (newNoti) => {
            // 실시간 알림을 React Query 캐시에 추가
            queryClient.setQueryData(
               ["notifications", locale],
               (oldData: unknown) => {
                  // oldData가 없거나 pages가 없으면 새로 생성
                  if (
                     !oldData ||
                     !(oldData as Record<string, unknown>).pages ||
                     !Array.isArray((oldData as Record<string, unknown>).pages)
                  ) {
                     return {
                        pages: [
                           {
                              notifications: [newNoti],
                              nextCursor: null,
                           },
                        ],
                     };
                  }

                  // pages 배열이 비어있거나 첫 번째 요소가 없으면 새로 생성
                  const oldDataObj = oldData as Record<string, unknown>;
                  const pages = oldDataObj.pages as unknown[];
                  if (pages.length === 0 || !pages[0]) {
                     return {
                        pages: [
                           {
                              notifications: [newNoti],
                              nextCursor: null,
                           },
                        ],
                     };
                  }

                  const updatedPages = pages.map(
                     (page: unknown, index: number) => {
                        if (index === 0) {
                           // 첫 번째 페이지에 새 알림 추가
                           if (typeof page === "object" && page !== null) {
                              const pageObj = page as Record<string, unknown>;
                              const notifications = Array.isArray(
                                 pageObj.notifications,
                              )
                                 ? pageObj.notifications
                                 : [];

                              return {
                                 ...pageObj,
                                 notifications: [newNoti, ...notifications],
                              };
                           }
                           // page가 객체가 아닌 경우 기본값 반환
                           return {
                              notifications: [newNoti],
                              nextCursor: null,
                           };
                        }
                        return page;
                     },
                  );

                  return {
                     ...(oldData as Record<string, unknown>),
                     pages: updatedPages,
                  };
               },
            );

            // 실시간 알림 상태도 업데이트
            setRealtimeNotifications((prev) => [newNoti, ...prev]);

            // unreadCount 즉시 증가
            setUnreadCount((prev) => (prev || 0) + 1);

            // 캐시 무효화로 서버와 동기화
            queryClient.invalidateQueries({
               queryKey: ["notifications", locale],
            });
         },
         () => {
            // SSE 연결 성공 시
         },
         () => {
            // SSE 연결 오류 시 1초 후 재연결 시도
            reconnectTimeoutRef.current = setTimeout(() => {
               connectSSEConnection();
            }, 1000);
         },
      );

      if (es) {
         eventSourceRef.current = es;

         // 연결 상태 모니터링 (1초마다 확인)
         const connectionCheckInterval = setInterval(() => {
            if (es.readyState === EventSource.CLOSED) {
               clearInterval(connectionCheckInterval);
            }
         }, 1000);

         // 연결 해제 시 interval 정리
         es.addEventListener("error", () => {
            clearInterval(connectionCheckInterval);
         });

         // 연결 종료 시 interval 정리
         es.addEventListener("close", () => {
            clearInterval(connectionCheckInterval);
         });
      }
   }, [user, queryClient, locale]);

   useEffect(() => {
      if (!user) {
         disconnectSSE();
         return;
      }

      // 초기 unreadCount 로드
      refreshUnreadCount();

      // SSE 연결 시도
      connectSSEConnection();

      // 컴포넌트 언마운트 시 정리
      return () => {
         disconnectSSE();
      };
   }, [user, connectSSEConnection, disconnectSSE, refreshUnreadCount]);

   // 페이지 포커스 시 unreadCount 새로고침 (SSE 로컬 상태와 충돌 방지)
   useEffect(() => {
      const handleFocus = () => {
         if (user) {
            // SSE로 받은 로컬 상태가 있으면 서버와 동기화만
            if (unreadCount !== null) {
               refreshUnreadCount();
            }
         }
      };

      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
   }, [user, refreshUnreadCount, unreadCount]);

   return (
      <NotificationContext.Provider
         value={{
            realtimeNotifications,
            unreadCount,
            refreshUnreadCount,
         }}
      >
         {children}
      </NotificationContext.Provider>
   );
}

export function useNotification() {
   const context = useContext(NotificationContext);
   if (!context)
      throw new Error(
         "NotificationContext must be used within a NotificationProvider",
      );
   return context;
}
