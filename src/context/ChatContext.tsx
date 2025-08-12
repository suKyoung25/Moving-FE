// context/ChatContext.tsx (수정된 버전)
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { sendMessage as firebaseSendMessage } from "@/lib/firebase/firebaseChat";
import { useAuth } from "./AuthContext";

interface ChatContextType {
   chatId: string;
   sendMessage: (text: string) => Promise<void>;
   setChatId: (id: string) => void;
   isInRoom: boolean;
   setIsInRoom: (inRoom: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
   const { user } = useAuth();
   const [chatId, setChatId] = useState("");
   const [isInRoom, setIsInRoom] = useState(false);

   const sendMessage = async (text: string) => {
      if (!user?.id || !chatId || !text.trim()) return;
      await firebaseSendMessage(chatId, user.id, text.trim());
   };

   return (
      <ChatContext.Provider
         value={{ chatId, sendMessage, setChatId, isInRoom, setIsInRoom }}
      >
         {children}
      </ChatContext.Provider>
   );
};

export const useChat = () => {
   const ctx = useContext(ChatContext);
   if (!ctx) throw new Error("useChat must be used within a ChatProvider");
   return ctx;
};
