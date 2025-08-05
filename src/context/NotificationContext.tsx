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

interface NotificationContextValue {
   realtimeNotifications: Notification[];
   addRealtimeNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
   null,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
   const [realtimeNotifications, setRealtimeNotifications] = useState<
      Notification[]
   >([]);
   const { user } = useAuth();

   useEffect(() => {
      if (!user) return; // 인증된 유저만 SSE 연결
      const es = connectSSE((newNoti) => {
         setRealtimeNotifications((prev) => [newNoti, ...prev]);
      });
      return () => es?.close();
   }, [user]);

   const addRealtimeNotification = (notification: Notification) => {
      setRealtimeNotifications((prev) => [notification, ...prev]);
   };

   return (
      <NotificationContext.Provider
         value={{ realtimeNotifications, addRealtimeNotification }}
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
