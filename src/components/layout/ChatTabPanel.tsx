"use client";

import ChatRoomList from "./ChatRoomList";
import ChatRoom from "./ChatRoom";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { markAllChatsAsRead } from "@/lib/firebase/firebaseChat";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReadAllButton from "../common/ReadAllButton";

export default function ChatTabPanel() {
   const { chatId } = useChat();
   const { user } = useAuth();
   const [isMarkingRead, setIsMarkingRead] = useState(false);

   const isFirstRender = useRef(true);
   useEffect(() => {
      isFirstRender.current = false;
   }, []);

   // 전체 읽기 핸들러
   const handleReadAll = async () => {
      if (!user?.id || isMarkingRead) return;
      setIsMarkingRead(true);
      try {
         await markAllChatsAsRead(user.id);
      } catch (error) {
         console.error("전체 읽기 실패:", error);
      } finally {
      }
   };

   return (
      <div className="relative h-[60vh] max-h-150 overflow-hidden rounded-xl bg-white">
         {/* 메인 채팅 목록 화면 */}
         <motion.div
            animate={{ x: chatId ? "-100%" : "0%" }}
            transition={
               isFirstRender.current
                  ? { duration: 0 } // 첫 렌더에서는 모션 제거
                  : { duration: 0.5, ease: "easeInOut" }
            }
            className="absolute inset-0 bg-white"
         >
            <div className="flex h-full flex-col p-4">
               <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-18-semibold lg:text-22-semibold">대화</h2>
                  <ReadAllButton
                     onClick={handleReadAll}
                     tooltipClass="!-left-5 "
                  />
               </div>
               <div className="scroll scrollbar-hide flex-1 overflow-y-auto">
                  <ChatRoomList />
               </div>
            </div>
         </motion.div>

         {/* 채팅방 슬라이드 화면 */}
         <AnimatePresence>
            {chatId && (
               <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={
                     isFirstRender.current
                        ? { duration: 0 } // 첫 렌더에서는 모션 제거
                        : { duration: 0.5, ease: "easeInOut" }
                  }
                  className="absolute inset-0 z-10"
               >
                  <ChatRoom />
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
