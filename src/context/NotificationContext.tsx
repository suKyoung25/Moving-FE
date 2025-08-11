"use client";

import React, {
   createContext,
   ReactNode,
   useContext,
   useEffect,
   useState,
} from "react";
import { Notification } from "@/lib/types/notification.types";
import {
   connectSSE,
   getNotifications,
} from "@/lib/api/notification/notification";
import { useAuth } from "./AuthContext";
import { useLocale } from "next-intl";

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

   // unreadCount 새로고침 함수
   const refreshUnreadCount = () => {
      if (!user) return;
      getNotifications({ limit: 1 }, locale).then((res) => {
         const rawCount = res.unreadCount ?? 0;
         setUnreadCount(rawCount > 0 ? rawCount : null);
      });
   };

   useEffect(() => {
      if (!user) return; // 인증된 유저만 SSE 연결

      // 초기 unreadCount 로드
      refreshUnreadCount();

      const es = connectSSE((newNoti) => {
         setRealtimeNotifications((prev) => [newNoti, ...prev]);
         // 실시간 알림 수신 시 unreadCount 새로고침
         refreshUnreadCount();
      });

      return () => es?.close();
   }, [user, refreshUnreadCount]);

   return (
      <NotificationContext.Provider
         value={{ realtimeNotifications, unreadCount, refreshUnreadCount }}
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
