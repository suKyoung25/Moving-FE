// 채팅방 참가자 타입
export interface Participant {
   profileImage?: string;
   nickname?: string;
}

// 참가자 목록 (userId → Participant)
export type ParticipantsMap = Record<string, Participant>;

// 메시지 타입 확장
export interface ChatMessage {
   id?: string;
   senderId: string;
   text: string;
   createdAt: number;
   isRead: boolean;
   readBy?: Record<string, boolean>;
   messageType?: "USER" | "SYSTEM_WITHDRAW"; // 메시지 타입 추가
}

// 채팅방 참가자 타입 확장
// 수정된 참가자 정보 타입
export interface ChatParticipant {
   userId: string;
   userName: string;
   profileImage: string;
   joinedAt: number;
   leftAt?: number;
   isActive: boolean;
   messageCount: number;
   isWithdrawn?: boolean; // 추가
   withdrawnAt?: number; // 추가
}

export interface ChatRoomSummary {
   chatId: string;
   lastMessage: {
      text: string;
      createdAt: number;
   };
   otherName: string;
   otherProfileImage: string;
   isActive: boolean;
   hasUnreadMessages: boolean;
   unreadCount: number;
   isOtherWithdrawn?: boolean; // 추가
}

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
