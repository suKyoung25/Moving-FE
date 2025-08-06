"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import avatar from "@/assets/images/avatarIcon.svg";
import EditButtons from "./EditButtons";
import MoverInfo from "./MoverInfo";
import { getMoverProfile } from "@/lib/api/mover/getMoverProfile";
import { Mover } from "@/lib/types/auth.types";

// 에러 바운더리 컴포넌트
class MoverCardErrorBoundary extends React.Component<
   { children: React.ReactNode; fallback: React.ComponentType },
   { hasError: boolean }
> {
   constructor(props: any) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError() {
      return { hasError: true };
   }

   render() {
      if (this.state.hasError) {
         return <this.props.fallback />;
      }
      return this.props.children;
   }
}

const ErrorFallback = () => (
   <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
      <div className="py-8 text-center text-red-500">
         프로필을 불러오는데 문제가 발생했습니다.
      </div>
   </section>
);

export default function MoverCard() {
   const [mover, setMover] = useState<Mover | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // 재시도 로직 제거, 단순화
   const fetchMoverData = useCallback(async () => {
      try {
         setError(null);
         const moverData = await getMoverProfile();
         setMover(moverData);
      } catch (err) {
         const errorMessage =
            err instanceof Error
               ? err.message
               : "프로필 정보를 불러오는데 실패했습니다.";
         setError(errorMessage);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchMoverData();
   }, [fetchMoverData]);

   // 메모이제이션된 컴포넌트들
   const profileImage = useMemo(
      () => (
         <Image
            src={mover?.profileImage || avatar}
            alt="프로필 이미지"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
            onError={(e) => {
               e.currentTarget.src = avatar;
            }}
            priority // 중요한 이미지이므로 우선 로딩
         />
      ),
      [mover?.profileImage],
   );

   const editButtonsDesktop = useMemo(
      () => (
         <div className="flex w-144 gap-4 max-lg:hidden lg:inline-flex">
            <EditButtons />
         </div>
      ),
      [],
   );

   if (loading) {
      return (
         <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
            <div className="animate-pulse">
               <div className="mb-4 flex items-center gap-4 lg:justify-between">
                  <div className="h-16 w-16 rounded-full bg-gray-200 lg:hidden"></div>
                  <div className="flex-1">
                     <div className="mb-2 h-6 rounded bg-gray-200"></div>
                     <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  </div>
               </div>
               <div className="mb-4 h-24 rounded bg-gray-200"></div>
            </div>
         </section>
      );
   }

   if (error || !mover) {
      return (
         <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
            <div className="py-8 text-center">
               <p className="mb-4 text-red-500">{error}</p>
               <button
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
               >
                  새로고침
               </button>
            </div>
         </section>
      );
   }

   return (
      <MoverCardErrorBoundary fallback={ErrorFallback}>
         <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
            <div className="flex items-center gap-4 lg:justify-between">
               <div className="block lg:hidden">{profileImage}</div>
               <div className="flex-1 lg:space-y-2">
                  <p className="font-semibold lg:text-2xl">
                     {mover.nickName || mover.name || ""}
                  </p>
                  <p className="text-sm font-normal text-gray-400 lg:text-xl">
                     {mover.introduction || "소개글이 없습니다."}
                  </p>
               </div>
               {editButtonsDesktop}
            </div>

            <div className="border-line-200 rounded-md border p-2.5 lg:flex lg:items-center lg:gap-6 lg:px-[18px] lg:py-6">
               <div className="hidden lg:block">{profileImage}</div>
               <MoverInfo
                  averageReviewRating={mover.averageReviewRating || 0}
                  reviewCount={mover.reviewCount || 0}
                  estimateCount={mover.estimateCount || 0}
                  career={mover.career || 0}
                  serviceType={mover.serviceType || []}
                  serviceArea={mover.serviceArea || []}
               />
            </div>
         </section>
      </MoverCardErrorBoundary>
   );
}
