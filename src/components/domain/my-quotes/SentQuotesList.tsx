"use client";

import { useState } from "react";
import { useSentEstimates } from "@/lib/api/estimate/query";
import QuoteCard from "./QuoteCard";
import Pagination from "@/components/common/pagination";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import SentQuotesSkeleton from "./SentQuotesSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { MyEstimateDetail } from "@/lib/types";
import ToastPopup from "@/components/common/ToastPopup";
import ConfirmModal from "@/components/common/ConfirmModal";
import { deleteEstimate } from "@/lib/api/estimate/requests/deleteEstimate";
import { useQueryClient } from "@tanstack/react-query";

export default function SentQuotesList() {
   const [page, setPage] = useState(1);
   const { data, isLoading } = useSentEstimates(page);
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
            text: "견적이 성공적으로 취소되었습니다.",
            success: true,
         });
         queryClient.invalidateQueries({ queryKey: ["sentEstimates"] });
         queryClient.invalidateQueries({ queryKey: ["rejectedEstimates"] });
      } else {
         setToast({
            id: Date.now(),
            text: "견적 취소 중 오류가 발생했습니다. 다시 시도해주세요.",
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
                  SkeletonComponent={SentQuotesSkeleton}
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
               <EmptyState message="아직 보낸 견적이 없습니다." />
            </div>
         )}

         {/* 페이지네이션은 항상 표시 */}
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
               title="견적 취소하기"
               description="정말 이 견적을 취소하시겠습니까?"
            />
         )}
      </div>
   );
}
