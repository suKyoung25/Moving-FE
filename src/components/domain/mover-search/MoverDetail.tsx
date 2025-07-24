"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Mover } from "@/lib/types/auth.types";
import { getMoverById } from "@/lib/api/mover/getMover";
import ActionButtons from "./ActionButtons";
import DetailSections from "./DetailSections";
import ShareSection from "./ShareSection";
import LineDivider from "../../common/LineDivider";
import DriverCard from "./DriverCard";
import { MoverProvider } from "@/components/domain/mover-search/MoverStateControll";

export default function MoverDetail() {
   const params = useParams();

   // API 호출 부분 주석 처리
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [mover, setMover] = useState<Mover | null>(null);

   useEffect(() => {
      const fetchMover = async () => {
         try {
            setLoading(true);
            const id = params.id as string;
            const moverData = await getMoverById(id);
            setMover(moverData);
         } catch (err) {
            console.error("Error fetching mover:", err);
            setError("기사님 정보를 불러오는데 실패했습니다.");
         } finally {
            setLoading(false);
         }
      };

      if (params.id) {
         fetchMover();
      }
   }, [params.id]);

   if (loading) {
      return (
         <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">로딩 중...</div>
         </div>
      );
   }

   if (error || !mover) {
      return (
         <div className="flex h-64 items-center justify-center">
            <div className="text-red-500">
               {error || "기사님 정보를 찾을 수 없습니다."}
            </div>
         </div>
      );
   }

   return (
      <MoverProvider>
      <div className="flex w-full flex-col gap-4 lg:gap-6">
         {/* Mobile Layout - Stack vertically */}
         <div className="flex flex-col gap-4 lg:hidden">
            <DriverCard mover={mover} />
            <LineDivider />
            <ShareSection />
            <DetailSections mover={mover} />
            <ActionButtons mover={mover} />
         </div>

         {/* Desktop Layout - Side by side */}
         <div className="hidden lg:flex lg:flex-row lg:justify-between lg:gap-6">
            <div className="flex w-full flex-col gap-6 lg:w-2/3">
               <DriverCard mover={mover} />
               <LineDivider />
               <DetailSections mover={mover} />
            </div>

            <div className="flex w-full flex-col gap-6 lg:w-1/3">
               <ActionButtons mover={mover} />
               <div className="hidden lg:block">
                  <LineDivider />
               </div>
               <ShareSection />
            </div>
         </div>
      </div>
      </MoverProvider>
   );
}
