"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
import closeIcon from "@/assets/images/xIcon.svg";
import Image from "next/image";
import { formatDateDiff } from "@/lib/utils";
import {
   connectSSE,
   getNotifications,
} from "@/lib/api/notification/getNotifications";
import { Notification } from "@/lib/types/notification.types";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

export default function NotificationModal({
   setIsNotiModalOpen,
   setHasUnread,
}: {
   setIsNotiModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
   setHasUnread: (val: boolean) => void;
}) {
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const router = useRouter();
   const modalRef = useRef<HTMLDivElement>(null);

   useClickOutside(modalRef, () => setIsNotiModalOpen(false));

   // 초기 알림 목록 fetch
   useEffect(() => {
      const fetchNotifications = async () => {
         try {
            const data = await getNotifications();
            console.log(data.notifications);
            setNotifications(data.notifications);
         } catch (err: any) {
            console.error("알림 목록 조회 실패:", err);
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
            setHasUnread(true);
         });
      };

      connect();

      return () => {
         es?.close();
      };
   }, []);

   return (
      <div
         ref={modalRef}
         className="border-line-200 scrollbar-hide absolute top-12 right-4 h-[314px] w-78 overflow-auto rounded-3xl border bg-white px-4 py-2.5 shadow-[2px_2px_16px_0px_rgba(0,0,0,0.06)] lg:h-88 lg:w-[359px]"
      >
         <div className="flex items-center justify-between py-[14px] pr-3 pl-4 lg:pl-6">
            <span className="font-bold lg:text-lg">알림</span>
            <button type="button" onClick={() => setIsNotiModalOpen(false)}>
               <Image src={closeIcon} alt="알림 닫기" className="h-6 w-6" />
            </button>
         </div>
         <ul className="hover:bg-bg-200 rounded-lg">
            {notifications.length > 0 ? (
               notifications.map((item, idx) => (
                  <button
                     key={idx}
                     onClick={() => router.push(item.targetUrl ?? "")}
                     className={`border-b-line-200 flex flex-col items-baseline gap-1 px-4 py-3 text-left font-medium max-lg:text-xs lg:px-6 lg:py-4 ${idx === notifications.length - 1 ? "" : "border-b-1"}`}
                  >
                     <div
                        dangerouslySetInnerHTML={{
                           __html: DOMPurify.sanitize(item.content),
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
