"use client";

import React, { useEffect, useRef } from "react";
import closeIcon from "@/assets/images/xIcon.svg";
import Image from "next/image";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { formatDateDiff } from "@/lib/utils";
import {
   readAllNotifications,
   readNotification,
} from "@/lib/api/notification/notification";
import { Notification } from "@/lib/types/notification.types";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import { useNotificationsQuery } from "@/lib/api/notification/query";
import { useQueryClient } from "@tanstack/react-query";
import { FiCheckSquare } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastConText";
import { getRequest } from "@/lib/api/estimate/requests/getClientRequest";
import { getEstimate } from "@/lib/api/estimate/getClientQuoteDetail";

export default function NotificationModal({
   setIsNotiModalOpen,
}: {
   setIsNotiModalOpen: (val: boolean) => void;
}) {
   const t = useTranslations("Notification");
   const { realtimeNotifications } = useNotification();
   const { showError } = useToast();
   const router = useRouter();
   const bottomRef = useRef<HTMLDivElement | null>(null);

   const queryClient = useQueryClient();

   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
      useNotificationsQuery();

   // 페이지 데이터를 flat하게 만들기
   const fetchedNotifications =
      data?.pages.flatMap((page) => page.notifications) ?? [];

   // 중복 제거 후 병합
   const notifications = [
      ...realtimeNotifications.filter(
         (r) => !fetchedNotifications.some((f) => f.id === r.id),
      ),
      ...fetchedNotifications,
   ];

   const handleClick = async (item: Notification) => {
      try {
         await readNotification(item.id);
         queryClient.invalidateQueries({ queryKey: ["notifications"] });
         if (!item.targetId) {
            return;
         }
         if (item.targetUrl?.startsWith("/my-quotes")) {
            const estimate = await getEstimate(item.targetId);
            if (!estimate) {
               showError("취소된 견적입니다.");
               return;
            }
         } else {
            const { data: request } = await getRequest(item.targetId);
            if (!request) {
               showError("취소된 견적 요청입니다.");
               return;
            }
         }
         router.push(item.targetUrl ?? "");
         setIsNotiModalOpen(false);
      } catch (err) {
         console.error("알림 읽기 실패", err);
      }
   };

   const handleReadAll = async () => {
      try {
         await readAllNotifications();
         queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } catch (err) {
         console.error("모든 알림 읽기 실패", err);
      }
   };

   useEffect(() => {
      if (!bottomRef.current || !hasNextPage || isFetchingNextPage) return;

      const observer = new IntersectionObserver(
         (entries) => {
            if (entries[0].isIntersecting) {
               fetchNextPage();
            }
         },
         { threshold: 1.0 },
      );

      observer.observe(bottomRef.current);

      return () => observer.disconnect();
   }, [bottomRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

   return (
      <div className="border-line-200 absolute top-10 -left-6 z-10 flex h-80 w-78 -translate-x-1/2 flex-col rounded-3xl border bg-white px-4 py-2.5 md:-left-8 lg:top-12 lg:-left-4 lg:h-88 lg:w-90">
         <div className="flex items-center justify-between py-3.5 pr-3 pl-4 md:-left-8 lg:top-12 lg:pl-6">
            <span className="lg:text-18-bold text-16-bold">{t("title")}</span>
            <div className="inline-flex items-center gap-2">
               <button
                  type="button"
                  onClick={handleReadAll}
                  className="group relative"
                  aria-label={t("readAllAria")}
               >
                  <div className="tooltip">{t("readAllTooltip")}</div>
                  <FiCheckSquare className="text-gray-500" />
               </button>
               <button
                  type="button"
                  onClick={() => setIsNotiModalOpen(false)}
                  aria-label={t("closeAria")}
               >
                  <Image
                     src={closeIcon}
                     alt={t("closeAlt")}
                     className="h-6 w-6"
                  />
               </button>
            </div>
         </div>
         <ul className="scrollbar-hide h-full overflow-auto">
            {isLoading ? (
               // TODO: skeleton 넣어주세요
               <div className="text-16-medium max-lg:text-12-medium py-4 text-center text-gray-400">
                  {t("loading")}
               </div>
            ) : notifications.length > 0 ? (
               notifications.map((item, idx) => (
                  <button
                     key={idx}
                     onClick={() => handleClick(item)}
                     className={`hover:bg-bg-200 border-b-line-200 text-16-medium max-lg:text-12-medium flex w-full flex-col items-baseline gap-1 rounded-lg px-4 py-3 text-left lg:px-6 lg:py-4 ${idx === notifications.length - 1 ? "" : "border-b-1"}`}
                  >
                     <div className={item.isRead ? "text-gray-300" : ""}>
                        {item.isRead
                           ? parse(
                                DOMPurify.sanitize(item.content, {
                                   FORBID_ATTR: ["style"],
                                   FORBID_TAGS: ["script"],
                                }),
                             )
                           : parse(DOMPurify.sanitize(item.content))}
                     </div>
                     <div className="lg:text-14-medium text-gray-300">
                        {formatDateDiff(item.createdAt)}
                     </div>
                  </button>
               ))
            ) : (
               <div className="mt-10 flex justify-center text-gray-400 max-lg:text-sm">
                  {t("empty")}
               </div>
            )}
            <div ref={bottomRef} />
            {isFetchingNextPage && (
               <div className="text-16-medium max-lg:text-12-medium py-4 text-center text-gray-400">
                  {t("loadingMore")}
               </div>
            )}
         </ul>
      </div>
   );
}
