export interface Notification {
   id: string;
   content: string;
   type: string;
   isRead: boolean;
   targetId?: string;
   targetUrl?: string;
   createdAt: string;
}