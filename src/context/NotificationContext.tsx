"use client";

import React, {
   createContext,
   ReactNode,
   useContext,
   useEffect,
   useState,
} from "react";
import { Notification } from "@/lib/types/notification.types";
import { connectSSE } from "@/lib/api/notification/notification";
import { useAuth } from "./AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface NotificationContextValue {
   realtimeNotifications: Notification[];
}

const NotificationContext = createContext<NotificationContextValue | null>(
   null,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
   const [realtimeNotifications, setRealtimeNotifications] = useState<
      Notification[]
   >([]);
   const { user } = useAuth();
   const queryClient = useQueryClient();

   useEffect(() => {
      if (!user) return; // 인증된 유저만 SSE 연결
      const es = connectSSE((newNoti) => {
         setRealtimeNotifications((prev) => [newNoti, ...prev]);
         queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
      return () => es?.close();
   }, [user]);

   return (
      <NotificationContext.Provider value={{ realtimeNotifications }}>
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
