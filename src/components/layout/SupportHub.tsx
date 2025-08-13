"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import HubPanel from "./HubPanel";
import { AnimatePresence } from "framer-motion";
import logoMobile from "@/assets/images/logoMobile.svg";
import Image from "next/image";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase/firebase";
import { handleUserInteraction, handleNewMessage } from "@/lib/utils";
import { useSupportHub } from "@/context/SupportHubContext";
import { ChatMessage } from "@/lib/types";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

export default function SupportHub() {
   const { user } = useAuth();
   const { isOpen, toggleHub } = useSupportHub();
   const [totalUnreadCount, setTotalUnreadCount] = useState(0);
   const wrapperRef = useRef<HTMLDivElement | null>(null);

   // 외부 클릭 시 HubPanel 닫기
   useOutsideClick(wrapperRef, () => {
      if (isOpen) toggleHub();
   });

   // 모든 채팅방 감시 + 알림 처리
   useEffect(() => {
      if (!user?.id) return;

      const chatsRef = ref(database, "chats");
      const previousMessageCounts: { [chatId: string]: number } = {};
      let isFirstLoad = true;

      const unsubscribe = onValue(chatsRef, (snapshot) => {
         const data = snapshot.val();
         if (!data) {
            setTotalUnreadCount(0);
            return;
         }

         let totalCount = 0;

         for (const chatId in data) {
            if (!chatId.includes(user.id)) continue;

            const room = data[chatId];
            const messages = room.messages
               ? Object.values(room.messages as ChatMessage)
               : [];

            const unreadCount = messages.filter(
               (msg) => msg.senderId !== user.id && !msg.isRead,
            ).length;

            totalCount += unreadCount;

            const currentMessageCount = messages.length;
            const previousCount = previousMessageCounts[chatId] || 0;

            if (
               !isFirstLoad &&
               currentMessageCount > previousCount &&
               messages.length > 0
            ) {
               const latestMessage = messages[messages.length - 1];
               handleNewMessage(chatId, latestMessage.senderId, user.id);
            }

            previousMessageCounts[chatId] = currentMessageCount;
         }

         setTotalUnreadCount(totalCount);
         isFirstLoad = false;
      });

      return () => unsubscribe();
   }, [user?.id]);

   // const handleAudioAllow = async () => {
   //    const success = await initializeAudioContext();
   //    if (success) {
   //       localStorage.setItem("audioPermissionAsked", "true");
   //       localStorage.setItem("audioPermissionGranted", "true");
   //    }
   //    setShowAudioModal(false);
   // };

   // const handleAudioDeny = () => {
   //    localStorage.setItem("audioPermissionAsked", "true");
   //    localStorage.setItem("audioPermissionGranted", "false");
   //    setShowAudioModal(false);
   // };

   // const handleAudioLater = () => {
   //    setShowAudioModal(false);
   // };

   // 버튼 클릭 시 오디오 초기화 + 패널 토글
   const handleButtonClick = async () => {
      await handleUserInteraction();
      toggleHub();
   };

   return (
      <>
         <div ref={wrapperRef} className="fixed right-6 bottom-6 z-10">
            {/* Floating 버튼 */}
            <button
               className="bg-primary-blue-300 shadow-global rounded-3xl p-2"
               onClick={handleButtonClick}
            >
               <Image
                  src={logoMobile}
                  alt="모바일 로고"
                  className="size-10 lg:size-12"
               />
            </button>

            {totalUnreadCount > 0 && !isOpen && (
               <span className="text-primary-blue-300 text-12-semibold shadow-global absolute -top-2 -right-2 z-40 flex size-6 items-center justify-center rounded-full bg-white">
                  {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
               </span>
            )}

            {/* HubPanel */}
            <AnimatePresence>
               {isOpen && (
                  <div>
                     <HubPanel />
                  </div>
               )}
            </AnimatePresence>
         </div>
      </>
   );
}
