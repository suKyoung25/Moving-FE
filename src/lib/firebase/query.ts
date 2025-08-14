// lib/firebase/query.ts (완전히 수정된 버전)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
   fetchMessages,
   sendMessage,
   subscribeToMessages,
   subscribeToTypingStatus,
   leaveChatRoom,
} from "@/lib/firebase/firebaseChat";
import { useEffect, useState } from "react";
import { handleNewMessage } from "@/lib/utils";
import { ChatMessage } from "../types";

export const useChatMessages = (chatId: string, userId: string) => {
   const queryClient = useQueryClient();
   const [isFirstLoad, setIsFirstLoad] = useState(true);

   const query = useQuery({
      queryKey: ["chatMessages", chatId, userId],
      queryFn: () => fetchMessages(chatId, userId),
      enabled: !!chatId && !!userId,
      staleTime: Infinity,
      initialData: [],
   });

   // 실시간 메시지 구독 - 사용자별 필터링 적용
   useEffect(() => {
      if (!chatId || !userId) return;

      const unsubscribe = subscribeToMessages(chatId, userId, (messages) => {
         //  첫 로드가 아니고, 새 메시지가 있으면 알림 처리
         if (!isFirstLoad && messages.length > 0) {
            const latestMessage = messages[messages.length - 1];

            // 새 메시지 알림 처리
            handleNewMessage(chatId, latestMessage.senderId, userId);
         }

         // 전체 메시지 배열로 캐시 업데이트
         queryClient.setQueryData<ChatMessage[]>(
            ["chatMessages", chatId, userId],
            messages,
         );

         // 첫 로드 완료 표시
         if (isFirstLoad) {
            setIsFirstLoad(false);
         }
      });

      return () => unsubscribe();
   }, [chatId, queryClient, userId, isFirstLoad]);

   // hatId가 변경되면 다시 첫 로드로 설정
   useEffect(() => {
      setIsFirstLoad(true);
   }, [chatId]);

   return query;
};

export const useTypingStatus = (chatId: string, otherUserId: string) => {
   const [isTyping, setIsTyping] = useState(false);

   useEffect(() => {
      if (!chatId || !otherUserId) return;
      const unsubscribe = subscribeToTypingStatus(
         chatId,
         otherUserId,
         setIsTyping,
      );
      return () => unsubscribe();
   }, [chatId, otherUserId]);

   return isTyping;
};

export function useSendMessage(chatId: string, userId: string) {
   return useMutation({
      mutationFn: (text: string) => sendMessage(chatId, userId, text),
   });
}

// 채팅방 나가기
export function useLeaveChatRoom() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ chatId, userId }: { chatId: string; userId: string }) =>
         leaveChatRoom(chatId, userId),
      onSuccess: (_, { chatId }) => {
         queryClient.invalidateQueries({ queryKey: ["chatMessages", chatId] });
      },
      onError: (error) => {
         console.error("채팅방 나가기 실패:", error);
      },
   });
}
