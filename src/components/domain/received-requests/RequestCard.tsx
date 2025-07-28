"use client";

import { useState } from "react";
import RequestActionModal from "./RequestActionModal";
import { ReceivedRequest } from "@/lib/types";

export default function RequestCard({ req }: { req: ReceivedRequest }) {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalType, setModalType] = useState<"accept" | "reject" | null>(null);

   const openModal = (type: "accept" | "reject") => {
      setModalType(type);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setModalType(null);
      setIsModalOpen(false);
   };

   return (
      <>
         <div key={req.id} className="mb-4 rounded border p-4 shadow-sm">
            <div className="text-sm text-gray-500">{req.moveType} 이사</div>
            <div className="font-bold">{req.clientName} 고객님</div>
            <div className="text-sm">
               출발: {req.fromAddress} → 도착: {req.toAddress}
            </div>
            {req.isDesignated && (
               <span className="mt-2 inline-block rounded bg-red-100 px-2 py-0.5 text-xs text-red-600">
                  지정 견적 요청
               </span>
            )}
            <p>이사일 : {req.moveDate}</p>
            <div className="mt-2 flex gap-4">
               <button
                  className="rounded bg-blue-500 px-3 py-1 text-white"
                  onClick={() => openModal("accept")}
               >
                  견적요청하기
               </button>
               <button
                  className="rounded bg-gray-500 px-3 py-1 text-white"
                  onClick={() => openModal("reject")}
               >
                  반려하기
               </button>
            </div>
         </div>

         <RequestActionModal
            isOpen={isModalOpen}
            onClose={closeModal}
            request={req}
            type={modalType}
            requestId={req.id}
            clientId={req.clientId}
         />
      </>
   );
}
