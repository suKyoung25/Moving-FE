"use client";

import { useState } from "react";
import { Mover, ReceivedRequest } from "@/lib/types";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import MoveTextCard from "../my-quotes/MoveTextCard";
import RequestActionModal from "./RequestActionModal";
import { useRouter } from "next/navigation";
import FormattedDateWithDay from "@/components/common/FormattedDateWithDay";
import { useLocale, useTranslations } from "next-intl";
import { createChatRoomIfNotExists } from "@/lib/firebase/createChatRoomIfNotExists";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { useSupportHub } from "@/context/SupportHubContext";
import ChatButton from "@/components/common/Chatbutton";
import formatAddress from "@/lib/utils/formatAddress.util";

export default function RequestCard({ req }: { req: ReceivedRequest }) {
   const t = useTranslations("ReceivedRequests");
   const locale = useLocale();
   const { openHub } = useSupportHub();

   const { user } = useAuth();
   const { setChatId } = useChat();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalType, setModalType] = useState<"accept" | "reject" | null>(null);
   const router = useRouter();

   const openModal = (type: "accept" | "reject") => {
      setModalType(type);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
      setModalType(null);
   };

   const handleCardClick = () => {
      router.push(`/received-requests/${req.id}`);
   };

   const handleChatClick = async (e: React.MouseEvent) => {
      e.stopPropagation();

      const clientId = req.clientId;
      const moverId = user!.id;
      const moverName = (user as Mover).nickName as string;
      const clientName = req.clientName;
      const chatId = `${user!.id}_${clientId}`;

      const moverProfileImage = user!.profileImage || "";
      const clientProfileImage = req.clientProfileImage || "";

      await createChatRoomIfNotExists({
         chatId,
         moverId,
         moverName,
         moverProfileImage,
         clientId,
         clientName,
         clientProfileImage,
      });

      setChatId(chatId);
      openHub();
   };

   return (
      <>
         {/* 요청 카드 UI */}
         <div
            onClick={handleCardClick}
            className="block cursor-pointer rounded-2xl shadow [&_div]:gap-3 [&_div]:md:gap-4"
         >
            <div className="border-line-100 flex flex-col rounded-2xl border px-3.5 py-4 lg:px-6 lg:py-5">
               <div className="flex items-center justify-between">
                  <div className="item-center flex gap-2">
                     <MoveChip type={(req.moveType as ChipType) ?? "PENDING"} />
                     {req.isDesignated && <MoveChip type="DESIGNATED" />}
                  </div>
                  <ChatButton onClick={handleChatClick} />
               </div>
               <span className="text-16-semibold lg:text-20-semibold">
                  {req.clientName} {t("clientHonorific")}
               </span>
               <div className="flex flex-col">
                  <div className="flex items-center md:hidden">
                     <MoveTextCard text={t("moveDateLabel")} />
                     <span>
                        <FormattedDateWithDay dateString={req.moveDate} />
                     </span>
                  </div>
                  <div className="bg-line-100 h-[1px]"></div>
                  <div className="[&_span]:lg:text-18-medium flex items-center">
                     <div className="hidden items-center md:flex">
                        <MoveTextCard text={t("moveDateLabel")} />
                        <span>
                           <FormattedDateWithDay dateString={req.moveDate} />
                        </span>
                     </div>
                     <MoveTextCard text={t("departureLabel")} />
                     <span>{formatAddress(req.fromAddress, locale)}</span>
                     <MoveTextCard text={t("destinationLabel")} />
                     <span>{formatAddress(req.toAddress, locale)}</span>
                  </div>
               </div>
               <div
                  onClick={(e) => e.stopPropagation()}
                  className="[&_button]:text-16-semibold [&_button]:lg:text-18-semibold mt-3 flex flex-col md:flex-row [&_button]:rounded-lg [&_button]:py-3"
               >
                  <button
                     className="bg-primary-blue-300 w-full text-white"
                     onClick={() => openModal("accept")}
                  >
                     {t("sendEstimateButton")}
                  </button>
                  <button
                     className="border-primary-blue-300 text-primary-blue-300 w-full border"
                     onClick={() => openModal("reject")}
                  >
                     {t("rejectButton")}
                  </button>
               </div>
            </div>
         </div>

         {modalType && (
            <RequestActionModal
               isOpen={isModalOpen}
               onClose={closeModal}
               modalType={modalType}
               request={req}
               requestId={req.id}
               clientId={req.clientId}
            />
         )}
      </>
   );
}
