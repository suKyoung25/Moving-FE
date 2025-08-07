"use client";

import EmptyState from "@/components/common/EmptyState";
import QuoteCard from "./QuoteCard";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import RejectedRequestsSkeleton from "./RejectedRequestsSkeleton";
import { useState } from "react";
import { MyEstimateDetail } from "@/lib/types";
import Pagination from "@/components/common/pagination";
import { useRejectedEstimates } from "@/lib/api/estimate/query";
import ToastPopup from "@/components/common/ToastPopup";
import ConfirmModal from "@/components/common/ConfirmModal";
import { deleteEstimate } from "@/lib/api/estimate/requests/deleteEstimate";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function RejectedRequestsList() {
   const t = useTranslations("MyQuotes.Mover");

   const [page, setPage] = useState(1);
   const { data, isLoading } = useRejectedEstimates(page);
   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   const [selectedEstimateId, setSelectedEstimateId] = useState<string | null>(
      null,
   );
   const queryClient = useQueryClient();

   const estimates = data?.data ?? [];
   const totalPages = data?.totalPages ?? 1;
   const hasEstimates = estimates.length > 0;

   const handleCancelEstimate = async () => {
      if (!selectedEstimateId) return;

      const res = await deleteEstimate(selectedEstimateId);
      setSelectedEstimateId(null);

      if (res) {
         setToast({
            id: Date.now(),
            text: t("toast.cancelSuccess"),
            success: true,
         });

         queryClient.invalidateQueries({ queryKey: ["sentEstimates"] });
         queryClient.invalidateQueries({ queryKey: ["rejectedEstimates"] });
      } else {
         setToast({
            id: Date.now(),
            text: t("toast.cancelError"),
            success: false,
         });
      }
   };

   return (
      <div>
         {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
               <SkeletonLayout
                  count={6}
                  SkeletonComponent={RejectedRequestsSkeleton}
               />
            </div>
         ) : hasEstimates ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
               {estimates.map((est: MyEstimateDetail) => (
                  <QuoteCard
                     key={est.id}
                     estimate={est}
                     onRequestCancel={() => setSelectedEstimateId(est.id)}
                  />
               ))}
            </div>
         ) : (
            <div className="flex items-center justify-center">
               <EmptyState message={t("rejectedemptyMessage")} />
            </div>
         )}

         <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
         />

         {toast && (
            <ToastPopup
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}

         {selectedEstimateId && (
            <ConfirmModal
               isOpen={!!selectedEstimateId}
               onClose={() => setSelectedEstimateId(null)}
               onConfirm={handleCancelEstimate}
               title={t("modal.title2")}
               description={t("modal.description2")}
            />
         )}
      </div>
   );
}
