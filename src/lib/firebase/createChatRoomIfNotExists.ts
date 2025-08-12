//createChatRoomIfNotExists.ts

// lib/firebase/firebaseChat.ts (프로필 이미지 추가된 버전)
import {
   ref,
   get,
   push,
   set,
   update,
   onValue,
   off,
   remove,
} from "firebase/database";
import { database } from "./firebase";
import { ChatMessage, ChatParticipant } from "../types";

// 채팅방 정보
export interface ChatRoom {
   participants: {
      [userId: string]: ChatParticipant;
   };
   lastMessage: {
      text: string;
      createdAt: number;
   };
   messages: Record<string, ChatMessage>;
   createdAt: number;
}

// 기본 이미지 URL (필요에 따라 수정)
const DEFAULT_PROFILE_IMAGE = "undefined";

// 프로필 이미지 처리 함수
const getValidProfileImage = (
   profileImage: string | null | undefined,
): string => {
   if (!profileImage || profileImage.trim() === "") {
      return DEFAULT_PROFILE_IMAGE;
   }
   return profileImage;
};

// 메시지 전송
export const sendMessage = async (
   chatId: string,
   senderId: string,
   text: string,
): Promise<void> => {
   const messageRef = ref(database, `chats/${chatId}/messages`);
   const newMsgRef = push(messageRef);

   const message: ChatMessage = {
      senderId,
      text,
      createdAt: Date.now(),
      isRead: false,
   };

   await set(newMsgRef, message);

   // 마지막 메시지 업데이트
   const lastMessageRef = ref(database, `chats/${chatId}/lastMessage`);
   await set(lastMessageRef, {
      text,
      createdAt: message.createdAt,
   });

   // 채팅방을 나간 사용자들을 다시 활성화
   await reactivateLeftParticipants(chatId, senderId);
};

// 메시지 전체 fetch (사용자별 필터링 적용)
export const fetchMessages = async (
   chatId: string,
   userId: string,
): Promise<ChatMessage[]> => {
   const snapshot = await get(ref(database, `chats/${chatId}/messages`));
   const messagesObj: Record<string, ChatMessage> = snapshot.val() || {};

   // 사용자의 채팅방 참여 정보 가져오기
   const participantSnapshot = await get(
      ref(database, `chats/${chatId}/participants/${userId}`),
   );
   const participant = participantSnapshot.val() as ChatParticipant;

   const allMessages = Object.entries(messagesObj)
      .map(([id, value]) => ({
         id,
         ...value,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);

   // 사용자가 채팅방을 나갔다가 다시 들어온 경우, leftAt 이후의 메시지만 표시
   if (participant?.leftAt) {
      return allMessages.filter((msg) => msg.createdAt > participant.leftAt!);
   }

   return allMessages;
};

// 실시간 메시지 구독 (사용자별 필터링 적용)
export const subscribeToMessages = (
   chatId: string,
   userId: string,
   onMessagesChange: (messages: ChatMessage[]) => void,
): (() => void) => {
   const messageRef = ref(database, `chats/${chatId}/messages`);

   onValue(messageRef, async (snapshot) => {
      const messagesObj = snapshot.val() || {};

      // 사용자의 채팅방 참여 정보 가져오기
      const participantSnapshot = await get(
         ref(database, `chats/${chatId}/participants/${userId}`),
      );
      const participant = participantSnapshot.val() as ChatParticipant;

      const allMessages = Object.entries(
         messagesObj as Record<string, ChatMessage>,
      )
         .map(([id, value]): ChatMessage & { id: string } => ({
            id,
            ...value,
         }))
         .sort((a, b) => a.createdAt - b.createdAt);

      // 사용자가 채팅방을 나갔다가 다시 들어온 경우, leftAt 이후의 메시지만 표시
      let filteredMessages = allMessages;
      if (participant?.leftAt) {
         filteredMessages = allMessages.filter(
            (msg) => msg.createdAt > participant.leftAt!,
         );
      }

      console.log(
         "Firebase에서 메시지 변경 감지:",
         filteredMessages.length,
         "개",
      );
      onMessagesChange(filteredMessages);
   });

   return () => off(messageRef);
};

// 채팅방 나가기
export const leaveChatRoom = async (
   chatId: string,
   userId: string,
): Promise<void> => {
   try {
      const participantRef = ref(
         database,
         `chats/${chatId}/participants/${userId}`,
      );
      const snapshot = await get(participantRef);

      if (snapshot.exists()) {
         // 나간 시간 기록하고 비활성화
         await update(participantRef, {
            leftAt: Date.now(),
            isActive: false,
         });

         // 모든 참가자가 나갔는지 확인
         await checkAndDeleteChatRoom(chatId);
      }
   } catch (error) {
      console.error("채팅방 나가기 중 오류:", error);
   }
};

// 모든 참가자가 나간 경우 채팅방 삭제
const checkAndDeleteChatRoom = async (chatId: string): Promise<void> => {
   try {
      const participantsRef = ref(database, `chats/${chatId}/participants`);
      const snapshot = await get(participantsRef);

      if (snapshot.exists()) {
         const participants = snapshot.val() as Record<string, ChatParticipant>;
         const activeParticipants = Object.values(participants).filter(
            (p) => p.isActive,
         );

         // 모든 참가자가 나간 경우 채팅방 전체 삭제
         if (activeParticipants.length === 0) {
            const chatRef = ref(database, `chats/${chatId}`);
            await remove(chatRef);
         }
      }
   } catch (error) {
      console.error("채팅방 삭제 확인 중 오류:", error);
   }
};

// 채팅방을 나간 참가자들을 다시 활성화 (새 메시지가 올 때)
const reactivateLeftParticipants = async (
   chatId: string,
   senderId: string,
): Promise<void> => {
   try {
      const participantsRef = ref(database, `chats/${chatId}/participants`);
      const snapshot = await get(participantsRef);

      if (snapshot.exists()) {
         const participants = snapshot.val() as Record<string, ChatParticipant>;
         const updates: Record<string, boolean> = {};

         Object.entries(participants).forEach(([userId, participant]) => {
            // 메시지를 보낸 사람이 아니고, 채팅방을 나간 상태인 경우
            if (
               userId !== senderId &&
               participant.leftAt &&
               !participant.isActive
            ) {
               updates[`${userId}/isActive`] = true;
            }
         });

         if (Object.keys(updates).length > 0) {
            await update(participantsRef, updates);
         }
      }
   } catch (error) {
      console.error("참가자 재활성화 중 오류:", error);
   }
};

// 메시지 읽음 처리 (수정된 버전)
export const markMessagesAsRead = async (chatId: string, userId: string) => {
   console.log("markMessagesAsRead 시작 - chatId:", chatId, "userId:", userId);

   try {
      const messageRef = ref(database, `chats/${chatId}/messages`);
      const snapshot = await get(messageRef);

      if (!snapshot.exists()) {
         return;
      }

      // 사용자의 leftAt 시간 확인
      const participantRef = ref(
         database,
         `chats/${chatId}/participants/${userId}`,
      );
      const participantSnapshot = await get(participantRef);
      const participant = participantSnapshot.val() as ChatParticipant;

      const updates: Record<string, boolean> = {};

      snapshot.forEach((child) => {
         const msg = child.val();

         // 내가 보낸 메시지가 아니고, 아직 읽지 않은 메시지인 경우
         // leftAt이 있다면 그 이후 메시지만 읽음 처리
         const shouldMarkAsRead =
            msg.senderId !== userId &&
            !msg.isRead &&
            (!participant?.leftAt || msg.createdAt > participant.leftAt);

         if (shouldMarkAsRead) {
            updates[`${child.key}/isRead`] = true;
         }
      });

      if (Object.keys(updates).length > 0) {
         await update(messageRef, updates);
      }
   } catch (error) {
      console.error("읽음 처리 중 오류:", error);
   }
};

// 입력 중 상태 설정
export const setTypingStatus = (
   chatId: string,
   userId: string,
   isTyping: boolean,
) => {
   const typingRef = ref(database, `chats/${chatId}/typingStatus/${userId}`);
   return set(typingRef, isTyping);
};

export const subscribeToTypingStatus = (
   chatId: string,
   otherUserId: string,
   callback: (isTyping: boolean) => void,
) => {
   const typingRef = ref(
      database,
      `chats/${chatId}/typingStatus/${otherUserId}`,
   );
   onValue(typingRef, (snapshot) => {
      callback(snapshot.val() || false);
   });
   return () => off(typingRef);
};

// 채팅방 생성 함수 (프로필 이미지 추가된 버전)
export const createChatRoomIfNotExists = async ({
   chatId,
   moverId,
   moverName,
   moverProfileImage,
   clientId,
   clientName,
   clientProfileImage,
}: {
   chatId: string;
   moverId: string;
   moverName: string;
   moverProfileImage: string;
   clientId: string;
   clientName: string;
   clientProfileImage: string;
}) => {
   const chatRef = ref(database, `chats/${chatId}`);
   const snapshot = await get(chatRef);

   if (!snapshot.exists()) {
      // 새 채팅방 생성
      await set(chatRef, {
         participants: {
            [moverId]: {
               userId: moverId,
               userName: moverName,
               profileImage: getValidProfileImage(moverProfileImage),
               joinedAt: Date.now(),
               isActive: true,
               messageCount: 0,
            },
            [clientId]: {
               userId: clientId,
               userName: clientName,
               profileImage: getValidProfileImage(clientProfileImage),
               joinedAt: Date.now(),
               isActive: true,
               messageCount: 0,
            },
         },
         lastMessage: {
            text: "",
            createdAt: Date.now(),
         },
         messages: {},
         createdAt: Date.now(),
      });
   } else {
      // 기존 채팅방이 있는 경우, 참가자들을 다시 활성화
      const existingChatRoom = snapshot.val();

      // 기존 스키마인지 새 스키마인지 확인
      const isOldSchema =
         typeof existingChatRoom.participants[moverId] === "string";

      if (isOldSchema) {
         // 기존 스키마를 새 스키마로 마이그레이션

         const updatedChatRoom: ChatRoom = {
            ...existingChatRoom,
            participants: {
               [moverId]: {
                  userId: moverId,
                  userName:
                     existingChatRoom.participants.moverName || moverName,
                  profileImage: getValidProfileImage(moverProfileImage),
                  joinedAt: existingChatRoom.createdAt || Date.now(),
                  isActive: true,
                  messageCount: 0,
               },
               [clientId]: {
                  userId: clientId,
                  userName:
                     existingChatRoom.participants.clientName || clientName,
                  profileImage: getValidProfileImage(clientProfileImage),
                  joinedAt: existingChatRoom.createdAt || Date.now(),
                  isActive: true,
                  messageCount: 0,
               },
            },
            createdAt: existingChatRoom.createdAt || Date.now(),
         };

         await set(chatRef, updatedChatRoom);
      } else {
         // 새 스키마인 경우, 참가자들을 활성화하고 프로필 이미지 업데이트
         const participants = existingChatRoom.participants;
         const updates: Record<string, boolean | string> = {};

         if (participants[moverId]) {
            if (!participants[moverId].isActive) {
               updates[`participants/${moverId}/isActive`] = true;
            }
            // 프로필 이미지 업데이트 (있는 경우)
            updates[`participants/${moverId}/profileImage`] =
               getValidProfileImage(moverProfileImage);
         }

         if (participants[clientId]) {
            if (!participants[clientId].isActive) {
               updates[`participants/${clientId}/isActive`] = true;
            }
            // 프로필 이미지 업데이트 (있는 경우)
            updates[`participants/${clientId}/profileImage`] =
               getValidProfileImage(clientProfileImage);
         }

         if (Object.keys(updates).length > 0) {
            await update(chatRef, updates);
         }
      }
   }
};
