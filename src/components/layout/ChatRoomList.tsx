// components/ChatRoomList.tsx 수정사항

import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase/firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import "dayjs/locale/ko";
import profileIcon from "@/assets/images/profileIcon.svg";
import { setCurrentChatId } from "@/lib/utils";
import { ChatMessage, ChatParticipant, ChatRoomSummary } from "@/lib/types";

dayjs.locale("ko");
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

function formatLastMessageTime(timestamp: number): string {
   const now = dayjs();
   const time = dayjs(timestamp);
   const diffInMinutes = now.diff(time, "minute");

   if (diffInMinutes < 1) {
      return "방금 전";
   }

   if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
   }

   if (time.isToday()) {
      return time.format("A h:mm");
   }

   if (time.isYesterday()) {
      return "어제";
   }

   if (now.year() === time.year()) {
      return time.format("MM월 DD일");
   }

   return time.format("YYYY년 MM월 DD일");
}

export default function ChatRoomList() {
   const { setChatId } = useChat();
   const { user } = useAuth();
   const [rooms, setRooms] = useState<ChatRoomSummary[]>([]);

   // ✅ 채팅 목록 페이지에서는 현재 채팅방을 null로 설정
   useEffect(() => {
      setCurrentChatId(null);
   }, []);

   useEffect(() => {
      if (!user?.id) return;

      const userId = user.id;
      const chatsRef = ref(database, "chats");

      const unsubscribe = onValue(chatsRef, (snapshot) => {
         const data = snapshot.val();
         if (!data) {
            setRooms([]);
            return;
         }

         const userRooms: ChatRoomSummary[] = [];

         for (const chatRoomId in data) {
            const room = data[chatRoomId];

            if (chatRoomId.includes(userId)) {
               const participants = room.participants;
               let otherName = "";
               let otherProfileImage = "";
               let isActive = true;
               let hasUnreadMessages = false;
               let unreadCount = 0;
               let isOtherWithdrawn = false; // 추가

               if (
                  participants[userId] &&
                  typeof participants[userId] === "object"
               ) {
                  const myParticipant = participants[userId] as ChatParticipant;
                  isActive =
                     myParticipant.isActive && !myParticipant.isWithdrawn; // 내가 탈퇴하지 않은 경우만

                  // 상대방 정보 찾기
                  for (const [participantId, participant] of Object.entries(
                     participants,
                  )) {
                     if (
                        participantId !== userId &&
                        typeof participant === "object"
                     ) {
                        const otherParticipant = participant as ChatParticipant;
                        otherName = otherParticipant.userName;
                        otherProfileImage = otherParticipant.profileImage;
                        isOtherWithdrawn =
                           otherParticipant.isWithdrawn === true; // 상대방 탈퇴 여부
                        break;
                     }
                  }

                  // 읽지 않은 메시지 계산
                  if (room.messages && room.hasMessages) {
                     const messages = Object.values(
                        room.messages,
                     ) as ChatMessage[];

                     if (myParticipant.leftAt) {
                        const newMessages = messages.filter(
                           (msg) =>
                              msg.createdAt > myParticipant.leftAt! &&
                              msg.senderId !== userId,
                        );
                        unreadCount = newMessages.filter(
                           (msg) => !msg.isRead,
                        ).length;
                        hasUnreadMessages = unreadCount > 0;
                     } else {
                        const unreadMessages = messages.filter(
                           (msg) => msg.senderId !== userId && !msg.isRead,
                        );
                        unreadCount = unreadMessages.length;
                        hasUnreadMessages = unreadCount > 0;
                     }
                  }
               } else {
                  // 기존 스키마 (하위 호환성)
                  const isClient = participants.clientId === userId;
                  otherName = isClient
                     ? participants.moverName
                     : participants.clientName;
                  otherProfileImage = "/images/default-avatar.png";
                  isActive = true;
                  isOtherWithdrawn = false;

                  if (room.messages && room.hasMessages) {
                     const messages = Object.values(
                        room.messages,
                     ) as ChatMessage[];
                     const unreadMessages = messages.filter(
                        (msg) => msg.senderId !== userId && !msg.isRead,
                     );
                     unreadCount = unreadMessages.length;
                     hasUnreadMessages = unreadCount > 0;
                  }
               }

               // 활성 상태이거나 읽지 않은 메시지가 있는 경우만 목록에 표시
               if (isActive || hasUnreadMessages) {
                  let lastMessageText = "아직 메시지가 없습니다";

                  if (room.hasMessages && room.lastMessage?.text) {
                     const myParticipant = participants[userId];

                     if (
                        myParticipant?.leftAt &&
                        room.lastMessage.createdAt <= myParticipant.leftAt
                     ) {
                        lastMessageText = "아직 메시지가 없습니다";
                     } else {
                        lastMessageText = room.lastMessage.text;
                     }
                  }

                  userRooms.push({
                     chatId: chatRoomId,
                     lastMessage: {
                        text: lastMessageText,
                        createdAt: room.lastMessage?.createdAt || 0,
                     },
                     otherName,
                     otherProfileImage,
                     isActive,
                     hasUnreadMessages,
                     unreadCount,
                     isOtherWithdrawn, // 추가
                  });
               }
            }
         }

         userRooms.sort((a, b) => {
            return b.lastMessage.createdAt - a.lastMessage.createdAt;
         });
         setRooms(userRooms);
      });

      return () => unsubscribe();
   }, [user?.id]);

   return (
      <div className="flex flex-col">
         {rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
               <div>아직 시작한 대화가 없어요!</div>
            </div>
         ) : (
            <ul className="flex flex-col">
               {rooms.map((room) => (
                  <li
                     key={room.chatId}
                     onClick={() => {
                        setChatId(room.chatId);
                     }}
                     className="border-line-100 hover:bg-hover-100 w-full cursor-pointer border-b px-2 py-3"
                  >
                     {/* 🔥 개선된 레이아웃 구조 */}
                     <div className="flex items-center gap-3">
                        {/* 프로필 이미지 - 고정 크기 */}
                        <div className="flex-shrink-0">
                           <div className="relative">
                              <img
                                 src={
                                    room.otherProfileImage &&
                                    room.otherProfileImage !== "undefined"
                                       ? room.otherProfileImage
                                       : profileIcon.src
                                 }
                                 alt={`${room.otherName} 프로필`}
                                 className={`h-12 w-12 rounded-full object-cover ${
                                    room.isOtherWithdrawn ? "grayscale" : ""
                                 }`}
                                 onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = profileIcon.src;
                                 }}
                              />
                              {/* 탈퇴한 사용자 표시 */}
                              {room.isOtherWithdrawn && (
                                 <div className="absolute -right-1 -bottom-1 rounded-full bg-gray-500 px-1 text-xs text-white">
                                    탈퇴
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* 메인 콘텐츠 영역 - flex-1로 남은 공간 사용 */}
                        <div className="min-w-0 flex-1">
                           {" "}
                           {/* min-w-0이 핵심! */}
                           {/* 상단: 이름과 시간 */}
                           <div className="mb-1 flex items-center justify-between">
                              <div className="flex min-w-0 flex-1 items-center">
                                 <span
                                    className={`text-16-regular truncate text-gray-500 ${
                                       room.isOtherWithdrawn
                                          ? "line-through"
                                          : ""
                                    }`}
                                 >
                                    {room.otherName}
                                 </span>
                                 {room.isOtherWithdrawn ? (
                                    <span className="text-14-regular ml-1 flex-shrink-0 text-gray-500">
                                       (탈퇴한 사용자)
                                    </span>
                                 ) : (
                                    <span className="ml-1 flex-shrink-0 text-gray-500">
                                       {user!.userType === "client"
                                          ? " 기사님"
                                          : " 고객님"}
                                    </span>
                                 )}
                              </div>

                              <span className="ml-2 flex-shrink-0 text-xs text-gray-400">
                                 {room.lastMessage?.createdAt
                                    ? formatLastMessageTime(
                                         room.lastMessage.createdAt,
                                      )
                                    : ""}
                              </span>
                           </div>
                           {/* 하단: 메시지와 읽지 않은 수 */}
                           <div className="flex items-center justify-between">
                              <p
                                 className={`text-14-regular mr-2 flex-1 truncate ${
                                    room.hasUnreadMessages
                                       ? "font-medium text-gray-900"
                                       : "text-gray-500"
                                 } ${room.isOtherWithdrawn ? "italic" : ""}`}
                              >
                                 {room.lastMessage.text}
                              </p>

                              {/* 읽지 않은 메시지 수 표시 - 오른쪽 고정 */}
                              {room.unreadCount > 0 && (
                                 <span className="bg-primary-blue-300 text-12-medium flex size-5.5 flex-shrink-0 items-center justify-center rounded-full text-white">
                                    {room.unreadCount > 99
                                       ? "99+"
                                       : room.unreadCount}
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
