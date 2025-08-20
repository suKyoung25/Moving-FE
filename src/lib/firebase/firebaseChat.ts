// lib/firebase/firebaseChat.ts
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
import { handleNewMessage } from "../utils";
import { ChatMessage, ChatParticipant } from "../types";

// ========================================
// 유틸리티 함수
// ========================================

// 유효한 프로필 이미지 URL 반환
const getValidProfileImage = (
   profileImage: string | null | undefined,
): string => {
   if (
      !profileImage ||
      profileImage.trim() === "" ||
      profileImage === "undefined"
   ) {
      return ""; // 빈 문자열 또는 기본 이미지 URL
   }
   return profileImage;
};

// 상대방 활성화 함수
const activateOtherParticipant = async (
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
            // 메시지를 보낸 사람이 아닌 경우만 활성화
            if (userId !== senderId && !participant.isActive) {
               updates[`${userId}/isActive`] = true;
            }
         });

         if (Object.keys(updates).length > 0) {
            await update(participantsRef, updates);
         }
      }
   } catch (error) {
      console.error("상대방 활성화 중 오류:", error);
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

// ========================================
// 채팅방 관리 기능
// ========================================

// 채팅방 생성/초기화
export const initializeChatRoom = async ({
   chatId,
   moverId,
   moverName,
   moverProfileImage,
   clientId,
   clientName,
   clientProfileImage,
   initiatorId, // 채팅을 시작한 사용자 ID
}: {
   chatId: string;
   moverId: string;
   moverName: string;
   moverProfileImage: string;
   clientId: string;
   clientName: string;
   clientProfileImage: string;
   initiatorId: string;
}) => {
   const chatRef = ref(database, `chats/${chatId}`);
   const snapshot = await get(chatRef);

   if (!snapshot.exists()) {
      // 새 채팅방 생성 - 초기화한 사용자만 활성화
      await set(chatRef, {
         participants: {
            [moverId]: {
               userId: moverId,
               userName: moverName,
               profileImage: getValidProfileImage(moverProfileImage),
               joinedAt: Date.now(),
               isActive: moverId === initiatorId, // 시작한 사용자만 활성화
               messageCount: 0,
            },
            [clientId]: {
               userId: clientId,
               userName: clientName,
               profileImage: getValidProfileImage(clientProfileImage),
               joinedAt: Date.now(),
               isActive: clientId === initiatorId, // 시작한 사용자만 활성화
               messageCount: 0,
            },
         },
         lastMessage: {
            text: "", // 빈 메시지로 시작
            createdAt: Date.now(),
         },
         messages: {},
         createdAt: Date.now(),
         hasMessages: false, // 실제 메시지가 있는지 표시
      });
   } else {
      // 기존 채팅방이 있는 경우
      const existingChatRoom = snapshot.val();
      const updates: Record<string, string | boolean> = {};

      // 시작한 사용자만 활성화
      if (!existingChatRoom.participants[initiatorId]?.isActive) {
         updates[`participants/${initiatorId}/isActive`] = true;
      }

      // 프로필 정보 업데이트
      updates[`participants/${moverId}/userName`] = moverName;
      updates[`participants/${moverId}/profileImage`] =
         getValidProfileImage(moverProfileImage);
      updates[`participants/${clientId}/userName`] = clientName;
      updates[`participants/${clientId}/profileImage`] =
         getValidProfileImage(clientProfileImage);

      if (Object.keys(updates).length > 0) {
         await update(chatRef, updates);
      }
   }
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

// 참가자 정보 가져오기
export const getChatRoomParticipants = async (chatId: string) => {
   try {
      const participantsRef = ref(database, `chats/${chatId}/participants`);
      const snapshot = await get(participantsRef);

      if (snapshot.exists()) {
         return snapshot.val() as Record<string, ChatParticipant>;
      }
      return {};
   } catch (error) {
      console.error("참가자 정보 가져오기 오류:", error);
      return {};
   }
};

// 활성 채팅방 목록 가져오기 (탈퇴한 사용자 제외)
export const getActiveChatRooms = async (userId: string) => {
   try {
      const chatsRef = ref(database, "chats");
      const snapshot = await get(chatsRef);

      if (!snapshot.exists()) {
         return [];
      }

      const chats = snapshot.val();
      const activeChatRooms = [];

      for (const chatId in chats) {
         const chat = chats[chatId];

         if (chat.participants && chat.participants[userId]) {
            const myParticipant = chat.participants[userId] as ChatParticipant;

            // 내가 탈퇴하지 않은 채팅방만 포함
            if (!myParticipant.isWithdrawn && myParticipant.isActive) {
               activeChatRooms.push({
                  chatId,
                  ...chat,
               });
            }
         }
      }

      return activeChatRooms;
   } catch (error) {
      console.error("활성 채팅방 조회 중 오류:", error);
      return [];
   }
};

// ========================================
// 메시지 관련 기능
// ========================================

// 메시지 전체 fetch (사용자별 필터링 적용)
export const fetchMessages = async (
   chatId: string,
   userId: string,
): Promise<ChatMessage[]> => {
   const snapshot = await get(ref(database, `chats/${chatId}/messages`));
   const messagesObj = snapshot.val() || {};

   // 사용자의 채팅방 참여 정보 가져오기
   const participantSnapshot = await get(
      ref(database, `chats/${chatId}/participants/${userId}`),
   );
   const participant = participantSnapshot.val() as ChatParticipant;

   const allMessages = Object.entries(messagesObj)
      .map(
         ([id, value]): ChatMessage => ({
            id,
            ...(value as Omit<ChatMessage, "id">),
         }),
      )
      .sort((a, b) => a.createdAt - b.createdAt);

   // leftAt이 있다면 그 시점 이후의 메시지만 반환
   if (participant?.leftAt) {
      const filteredMessages = allMessages.filter(
         (msg) => msg.createdAt > participant.leftAt!,
      );

      return filteredMessages;
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
   let previousCount = 0;
   let isFirstLoad = true;

   onValue(messageRef, async (snapshot) => {
      const messagesObj = snapshot.val() || {};

      // 사용자의 채팅방 참여 정보 가져오기
      const participantSnapshot = await get(
         ref(database, `chats/${chatId}/participants/${userId}`),
      );
      const participant = participantSnapshot.val() as ChatParticipant;

      const allMessages = Object.entries(messagesObj)
         .map(
            ([id, value]): ChatMessage => ({
               id,
               ...(value as Omit<ChatMessage, "id">),
            }),
         )
         .sort((a, b) => a.createdAt - b.createdAt);

      // leftAt이 있다면 그 시점 이후의 메시지만 반환
      let filteredMessages = allMessages;
      if (participant?.leftAt) {
         filteredMessages = allMessages.filter(
            (msg) => msg.createdAt > participant.leftAt!,
         );
      }

      // 새 메시지 알림 처리
      if (!isFirstLoad && filteredMessages.length > previousCount) {
         const newMessages = filteredMessages.slice(previousCount);

         newMessages.forEach((msg) => {
            const sender = String(msg.senderId).trim();
            const me = String(userId).trim();
            const isMyMessage = sender === me;
            const isSystemMessage =
               msg.senderId === "SYSTEM" ||
               msg.messageType === "SYSTEM_WITHDRAW";

            // 상대방이 보낸 일반 메시지만 알림 처리
            if (!isMyMessage && !isSystemMessage) {
               handleNewMessage(chatId, sender, me);
            }
         });
      }

      isFirstLoad = false;
      previousCount = filteredMessages.length;

      onMessagesChange(filteredMessages);
   });

   return () => off(messageRef);
};

// 메시지 전송 (기본)
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

   // hasMessages를 true로 설정
   const hasMessagesRef = ref(database, `chats/${chatId}/hasMessages`);
   await set(hasMessagesRef, true);

   // 메시지를 보낼 때 상대방을 자동으로 활성화
   await activateOtherParticipant(chatId, senderId);
};

// 탈퇴한 사용자와의 채팅 여부 확인
export const checkIfOtherUserWithdrawn = async (
   chatId: string,
   myUserId: string,
): Promise<boolean> => {
   try {
      const participantsRef = ref(database, `chats/${chatId}/participants`);
      const snapshot = await get(participantsRef);

      if (!snapshot.exists()) {
         return false;
      }

      const participants = snapshot.val() as Record<string, ChatParticipant>;

      // 상대방 찾기
      const otherParticipant = Object.values(participants).find(
         (participant) => participant.userId !== myUserId,
      );

      return otherParticipant?.isWithdrawn === true;
   } catch (error) {
      console.error("상대방 탈퇴 상태 확인 중 오류:", error);
      return false;
   }
};

// 탈퇴 체크가 포함된 메시지 전송
export const sendMessageWithWithdrawCheck = async (
   chatId: string,
   senderId: string,
   text: string,
): Promise<{ success: boolean; error?: string }> => {
   try {
      // 상대방이 탈퇴했는지 확인
      const isOtherWithdrawn = await checkIfOtherUserWithdrawn(
         chatId,
         senderId,
      );

      if (isOtherWithdrawn) {
         return {
            success: false,
            error: "탈퇴한 사용자에게는 메시지를 보낼 수 없습니다.",
         };
      }

      // 기존 메시지 전송 로직
      await sendMessage(chatId, senderId, text);
      return { success: true };
   } catch (error) {
      console.error("메시지 전송 중 오류:", error);
      return {
         success: false,
         error: "메시지 전송에 실패했습니다.",
      };
   }
};

// ========================================
// 메시지 읽음 처리 기능
// ========================================

// 개별 채팅방 메시지 읽음 처리
export const markMessagesAsRead = async (chatId: string, userId: string) => {
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
         const msg = child.val() as ChatMessage;

         // 내가 보낸 메시지가 아니고, 아직 읽지 않은 메시지인 경우
         // leftAt이 있다면 그 이후 메시지만 읽음 처리
         const shouldMarkAsRead =
            msg.senderId !== userId &&
            !msg.isRead &&
            (!participant?.leftAt || msg.createdAt > participant.leftAt);

         if (shouldMarkAsRead && child.key) {
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

// 전체 채팅방 메시지 읽음 처리
export const markAllChatsAsRead = async (userId: string): Promise<void> => {
   try {
      const chatsRef = ref(database, "chats");
      const snapshot = await get(chatsRef);

      if (!snapshot.exists()) {
         return;
      }

      const chats = snapshot.val();
      const updates: Record<string, boolean> = {};

      for (const chatId in chats) {
         const chat = chats[chatId];

         // 내가 참여한 채팅방이고 활성화된 경우만
         if (chat.participants && chat.participants[userId]?.isActive) {
            const myParticipant = chat.participants[userId] as ChatParticipant;

            if (chat.messages) {
               Object.entries(chat.messages).forEach(([messageId, message]) => {
                  const msg = message as ChatMessage;
                  // 내가 보낸 메시지가 아니고, 아직 읽지 않은 메시지인 경우
                  // leftAt이 있다면 그 이후 메시지만 읽음 처리
                  const shouldMarkAsRead =
                     msg.senderId !== userId &&
                     !msg.isRead &&
                     (!myParticipant?.leftAt ||
                        msg.createdAt > myParticipant.leftAt);

                  if (shouldMarkAsRead) {
                     updates[`${chatId}/messages/${messageId}/isRead`] = true;
                  }
               });
            }
         }
      }

      if (Object.keys(updates).length > 0) {
         await update(chatsRef, updates);
      }
   } catch (error) {
      console.error("전체 읽음 처리 중 오류:", error);
      throw error;
   }
};

// 총 읽지 않은 메시지 수 계산
export const getTotalUnreadCount = (
   userId: string,
   callback: (count: number) => void,
): (() => void) => {
   const chatsRef = ref(database, "chats");

   const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
         callback(0);
         return;
      }

      let totalUnreadCount = 0;

      for (const chatRoomId in data) {
         const room = data[chatRoomId];

         // 내가 참여한 채팅방이고 활성화된 경우만
         if (
            chatRoomId.includes(userId) &&
            room.participants[userId]?.isActive
         ) {
            const myParticipant = room.participants[userId] as ChatParticipant;

            if (room.messages && room.hasMessages) {
               const messages = Object.values(room.messages) as ChatMessage[];

               // 내가 채팅방을 나간 경우: leftAt 이후의 메시지만 확인
               if (myParticipant.leftAt) {
                  const newMessages = messages.filter(
                     (msg) =>
                        msg.createdAt > myParticipant.leftAt! &&
                        msg.senderId !== userId &&
                        !msg.isRead,
                  );
                  totalUnreadCount += newMessages.length;
               } else {
                  // 활성 상태: 읽지 않은 메시지 확인
                  const unreadMessages = messages.filter(
                     (msg) => msg.senderId !== userId && !msg.isRead,
                  );
                  totalUnreadCount += unreadMessages.length;
               }
            }
         }
      }

      callback(totalUnreadCount);
   });

   return () => unsubscribe();
};

// ========================================
// 타이핑 상태 관리 기능
// ========================================

// 입력 중 상태 설정
export const setTypingStatus = (
   chatId: string,
   userId: string,
   isTyping: boolean,
) => {
   const typingRef = ref(database, `chats/${chatId}/typingStatus/${userId}`);
   return set(typingRef, isTyping);
};

// 타이핑 상태 구독
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

// ========================================
// 사용자 관리 기능
// ========================================

// 프로필 수정 시 Firebase 반영
export const updateUserProfileInChats = async (
   userId: string,
   newUserName: string,
   newProfileImage?: string,
): Promise<void> => {
   try {
      const chatsRef = ref(database, "chats");
      const snapshot = await get(chatsRef);

      if (!snapshot.exists()) {
         return;
      }

      const chats = snapshot.val();
      const updates: Record<string, string> = {};

      for (const chatId in chats) {
         const chat = chats[chatId];

         if (chat.participants && chat.participants[userId]) {
            if (typeof chat.participants[userId] === "object") {
               // 이름은 항상 업데이트
               updates[`${chatId}/participants/${userId}/userName`] =
                  newUserName;

               // 이미지 업데이트 로직
               if (newProfileImage !== undefined) {
                  const validImageUrl = getValidProfileImage(newProfileImage);
                  updates[`${chatId}/participants/${userId}/profileImage`] =
                     validImageUrl;
               }
            }
         }
      }

      if (Object.keys(updates).length > 0) {
         await update(chatsRef, updates);
      }
   } catch (error) {
      console.error("채팅방 프로필 정보 업데이트 오류:", error);
      throw error;
   }
};

// 회원 탈퇴 시 모든 채팅방에서 사용자 정보 업데이트
export const updateUserStatusOnWithdraw = async (
   userId: string,
): Promise<void> => {
   try {
      const chatsRef = ref(database, "chats");
      const snapshot = await get(chatsRef);

      if (!snapshot.exists()) {
         return;
      }

      const chats = snapshot.val();
      const updates: Record<
         string,
         | string
         | number
         | boolean
         | ChatMessage
         | { text: string; createdAt: number }
      > = {};

      for (const chatId in chats) {
         const chat = chats[chatId];

         if (chat.participants && chat.participants[userId]) {
            // 참가자 상태를 탈퇴로 변경
            updates[`${chatId}/participants/${userId}/isWithdrawn`] = true;
            updates[`${chatId}/participants/${userId}/withdrawnAt`] =
               Date.now();
            updates[`${chatId}/participants/${userId}/isActive`] = false;

            // 시스템 메시지 추가
            const systemMessageRef = push(
               ref(database, `chats/${chatId}/messages`),
            );
            const systemMessageKey = systemMessageRef.key;

            if (systemMessageKey) {
               const systemMessage: ChatMessage = {
                  senderId: "SYSTEM",
                  text: `${chat.participants[userId].userName}님이 서비스를 탈퇴했습니다.`,
                  createdAt: Date.now(),
                  isRead: false,
                  messageType: "SYSTEM_WITHDRAW",
               };

               updates[`${chatId}/messages/${systemMessageKey}`] =
                  systemMessage;

               // 마지막 메시지 업데이트
               updates[`${chatId}/lastMessage`] = {
                  text: systemMessage.text,
                  createdAt: systemMessage.createdAt,
               };

               // hasMessages를 true로 설정
               updates[`${chatId}/hasMessages`] = true;
            }
         }
      }

      if (Object.keys(updates).length > 0) {
         await update(chatsRef, updates);
      }
   } catch (error) {
      console.error("사용자 탈퇴 처리 중 오류:", error);
      throw error;
   }
};
