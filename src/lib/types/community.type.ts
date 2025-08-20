export interface CommunityWithDetails {
   id: string;
   title: string;
   content: string;
   createdAt: Date;
   updatedAt: Date;
   clientId: string | null;
   moverId: string | null;
   userNickname: string;
   profileImg: string | null;
   replies: ReplyWithDetails[];
}

export interface ReplyWithDetails {
   id: string;
   content: string;
   createdAt: Date;
   communityId: string;
   clientId: string | null;
   moverId: string | null;
   userNickname: string;
   profileImg: string | null;
}

export interface PostReplyResponse {
   id: string;
   content: string;
   createdAt: string;
}

export interface PostReplyError {
   message: string;
}
