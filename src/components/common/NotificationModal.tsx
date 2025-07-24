"use client";

import React, { useEffect, useState } from "react";
import closeIcon from "@/assets/images/xIcon.svg";
import Image from "next/image";
import { formatDateDiff } from "@/lib/utils";
import {
   connectSSE,
   getNotifications,
   readNotification,
} from "@/lib/api/notification/notificationApi";
import { Notification } from "@/lib/types/notification.types";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";

export default function NotificationModal({
   setIsNotiModalOpen,
   setHasUnread,
}: {
   setIsNotiModalOpen: (val: boolean) => void;
   setHasUnread: (val: boolean) => void;
}) {
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const router = useRouter();

   const handleClick = async (item: Notification) => {
      try {
         await readNotification(item.id);
         setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
         );
         router.push(item.targetUrl ?? "");
         setIsNotiModalOpen(false);
      } catch (err) {
         console.error("알림 읽기 실패", err);
      }
   };

   // 초기 알림 목록 fetch
   useEffect(() => {
      const fetchNotifications = async () => {
         try {
            const data = await getNotifications();
            setNotifications(data.notifications);
         } catch (err: unknown) {
            if (err instanceof Error) {
               console.error("알림 목록 조회 실패:", err.message);
            } else {
               console.error("알림 목록 조회 실패:", err);
            }
         }
      };

      fetchNotifications();
   }, []);

   // SSE 연결
   useEffect(() => {
      let es: EventSource | null = null;

      const connect = async () => {
         es = connectSSE((newNoti) => {
            setNotifications((prev) => [newNoti, ...prev]);
         });
      };

      connect();

      return () => {
         es?.close();
      };
   }, []);

   // 알림을 열면 읽음 처리
   useEffect(() => {
      setHasUnread(false);
   }, [setHasUnread]);

   return (
      <div className="border-line-200 absolute top-10 -left-6 z-100 flex h-80 w-78 -translate-x-1/2 flex-col rounded-3xl border bg-white px-4 py-2.5 shadow-[2px_2px_16px_0px_rgba(0,0,0,0.06)] md:-left-8 lg:top-12 lg:-left-4 lg:h-88 lg:w-90">
         <div className="flex items-center justify-between py-3.5 pr-3 pl-4 md:-left-8 lg:top-12 lg:pl-6">
            <span className="font-bold lg:text-lg">알림</span>
            <button type="button" onClick={() => setIsNotiModalOpen(false)}>
               <Image src={closeIcon} alt="알림 닫기" className="h-6 w-6" />
            </button>
         </div>
         <ul className="scrollbar-hide h-full overflow-auto">
            {notifications.length > 0 ? (
               notifications.map((item, idx) => (
                  <button
                     key={idx}
                     onClick={() => handleClick(item)}
                     className={`hover:bg-bg-200 border-b-line-200 flex w-full flex-col items-baseline gap-1 rounded-lg px-4 py-3 text-left font-medium max-lg:text-xs lg:px-6 lg:py-4 ${idx === notifications.length - 1 ? "" : "border-b-1"}`}
                  >
                     <div
                        className={item.isRead ? "text-gray-300" : ""}
                        dangerouslySetInnerHTML={{
                           __html: item.isRead
                              ? DOMPurify.sanitize(item.content, {
                                   FORBID_ATTR: ["style"],
                                   FORBID_TAGS: ["script"],
                                })
                              : DOMPurify.sanitize(item.content),
                        }}
                     />
                     <div className="text-gray-300 lg:text-sm">
                        {formatDateDiff(item.createdAt)}
                     </div>
                  </button>
               ))
            ) : (
               <div className="mt-10 flex justify-center text-gray-400 max-lg:text-sm">
                  알림이 존재하지 않습니다.
               </div>
            )}
         </ul>
      </div>
   );
}
