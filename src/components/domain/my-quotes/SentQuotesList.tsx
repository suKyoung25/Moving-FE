"use client";

import { useState } from "react";
import { useSentEstimates } from "@/lib/api/estimate/query";
import QuoteCard from "./QuoteCard";
import Pagination from "@/components/common/Pagination";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import SentQuotesSkeleton from "./SentQuotesSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { MyEstimateDetail } from "@/lib/types";
import ConfirmModal from "@/components/common/ConfirmModal";
import { deleteEstimate } from "@/lib/api/estimate/requests/deleteEstimate";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastConText";
import { useLocale, useTranslations } from "next-intl";

export default function SentQuotesList() {
   const t = useTranslations("MyQuotes.Mover");
   const locale = useLocale();

   const [page, setPage] = useState(1);
   const { data, isLoading } = useSentEstimates(page, locale);
   const { showSuccess, showError } = useToast();

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
         showSuccess(t("toast.cancelSuccess"));
         queryClient.invalidateQueries({ queryKey: ["sentEstimates"] });
         queryClient.invalidateQueries({ queryKey: ["rejectedEstimates"] });
      } else {
         showError(t("toast.cancelError"));
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
               <EmptyState message={t("emptyMessage")} />
            </div>
         )}

         {/* 페이지네이션은 항상 표시 */}
         <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
         />

         {selectedEstimateId && (
            <ConfirmModal
               isOpen={!!selectedEstimateId}
               onClose={() => setSelectedEstimateId(null)}
               onConfirm={handleCancelEstimate}
               title={t("modal.title")}
               description={t("modal.description")}
            />
         )}
      </div>
   );
}
