"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import avatar from "@/assets/images/avatarIcon.svg";
import EditButtons from "./EditButtons";
import MoverInfo from "./MoverInfo";
import { getMoverProfile } from "@/lib/api/mover/getMoverProfile";
import { Mover } from "@/lib/types/auth.types";
import { useAuth } from "@/context/AuthContext";

export default function MoverCard() {
   const [mover, setMover] = useState<Mover | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [retryCount, setRetryCount] = useState(0);
   const { user, isLoading: authLoading } = useAuth();

   const fetchMoverData = useCallback(async () => {
     try {
       setError(null);
       setLoading(true);
       
       console.log('기사님 프로필 조회 시작...');
       const moverData = await getMoverProfile();
       console.log('조회된 기사님 데이터:', moverData);
       
       setMover(moverData);
       setRetryCount(0); // 성공 시 재시도 카운트 리셋
       
     } catch (err) {
       console.error('기사님 정보 조회 실패:', err);
       
       const errorMessage = err instanceof Error ? err.message : '프로필 정보를 불러오는데 실패했습니다.';
       setError(errorMessage);
       
       // 인증 관련 오류면 사용자에게 재로그인 안내
       if (errorMessage.includes('로그인') || errorMessage.includes('인증')) {
         setError('로그인이 만료되었습니다. 다시 로그인해 주세요.');
       }
       
     } finally {
       setLoading(false);
     }
   }, []);

   // 재시도 함수
   const handleRetry = useCallback(() => {
     if (retryCount < 3) { // 최대 3회까지만 재시도
       setRetryCount(prev => prev + 1);
       fetchMoverData();
     } else {
       setError('여러 번 시도했지만 데이터를 불러올 수 없습니다. 페이지를 새로고침해 주세요.');
     }
   }, [retryCount, fetchMoverData]);

   useEffect(() => {
     // 인증이 완료되고 사용자가 기사님인 경우에만 데이터 조회
     if (!authLoading && user?.userType === 'mover') {
       fetchMoverData();
     } else if (!authLoading && user?.userType !== 'mover') {
       setError('기사님 전용 페이지입니다.');
       setLoading(false);
     }
   }, [authLoading, user, fetchMoverData]);

   // 인증 로딩 중
   if (authLoading) {
     return (
       <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
         <div className="animate-pulse">
           <div className="flex items-center gap-4 lg:justify-between mb-4">
             <div className="h-16 w-16 bg-gray-200 rounded-full lg:hidden"></div>
             <div className="flex-1">
               <div className="h-6 bg-gray-200 rounded mb-2"></div>
               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
             </div>
           </div>
           <div className="h-24 bg-gray-200 rounded"></div>
         </div>
       </section>
     );
   }

   // 데이터 로딩 중
   if (loading) {
     return (
       <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
         <div className="animate-pulse">
           <div className="flex items-center gap-4 lg:justify-between mb-4">
             <div className="h-16 w-16 bg-gray-200 rounded-full lg:hidden"></div>
             <div className="flex-1">
               <div className="h-6 bg-gray-200 rounded mb-2"></div>
               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
             </div>
           </div>
           <div className="h-24 bg-gray-200 rounded mb-4"></div>
           <div className="text-center text-sm text-gray-500">
             기사님 정보를 불러오는 중...
           </div>
         </div>
       </section>
     );
   }

   // 에러 상태
   if (error || !mover) {
     return (
       <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
         <div className="text-center py-8">
           <div className="text-red-500 mb-4">
             <p className="mb-2 font-medium">프로필 정보를 불러올 수 없습니다.</p>
             {error && <p className="text-sm text-gray-600">{error}</p>}
           </div>
           
           <div className="flex gap-2 justify-center">
             {retryCount < 3 ? (
               <button 
                 onClick={handleRetry}
                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                 disabled={loading}
               >
                 {loading ? '재시도 중...' : `다시 시도 (${retryCount + 1}/3)`}
               </button>
             ) : (
               <button 
                 onClick={() => window.location.reload()} 
                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
               >
                 페이지 새로고침
               </button>
             )}
           </div>
           
           {error?.includes('로그인') && (
             <div className="mt-4">
               <button 
                 onClick={() => window.location.href = '/login'}
                 className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
               >
                 로그인 페이지로 이동
               </button>
             </div>
           )}
         </div>
       </section>
     );
   }

   return (
      <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
         <div className="flex items-center gap-4 lg:justify-between">
            <div className="block lg:hidden">
               <Image 
                 src={mover.profileImage || avatar} 
                 alt="프로필 이미지" 
                 width={64}
                 height={64}
                 className="h-16 w-16 rounded-full object-cover" 
                 onError={(e) => {
                   // 이미지 로드 실패 시 기본 아바타로 대체
                   e.currentTarget.src = avatar;
                 }}
               />
            </div>
            <div className="lg:space-y-2 flex-1">
               <p className="font-semibold lg:text-2xl">
                 {mover.nickName || mover.name || '이름 없음'}
               </p>
               <p className="text-sm font-normal text-gray-400 lg:text-xl">
                  {mover.introduction || mover.description || '소개글이 없습니다.'}
               </p>
            </div>
            <div className="flex w-144 gap-4 max-lg:hidden lg:inline-flex">
               <EditButtons />
            </div>
         </div>
         
         <div className="border-line-200 rounded-md border p-2.5 lg:flex lg:items-center lg:gap-6 lg:px-[18px] lg:py-6">
            <div className="hidden lg:block">
               <Image 
                 src={mover.profileImage || avatar} 
                 alt="프로필 이미지" 
                 width={64}
                 height={64}
                 className="h-16 w-16 rounded-full object-cover" 
                 onError={(e) => {
                   e.currentTarget.src = avatar;
                 }}
               />
            </div>
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
   );
}