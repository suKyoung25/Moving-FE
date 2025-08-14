"use client";

import {
   useState,
   useCallback,
   memo,
   useMemo,
   useTransition,
   useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MoverProfile from "@/components/common/MoverProfile";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import { getFavoriteMovers } from "@/lib/api/favorite/favorites/getFavoriteMovers";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { Mover } from "@/lib/types/auth.types";
import { tokenSettings } from "@/lib/utils/auth.util";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastConText";
import { EstimateStatus } from "@/lib/types";
import { useTranslations } from "next-intl";

interface FavoriteDriverListProps {
   onFavoriteChange?: (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => void;
   refreshKey?: number;
}

// 함수를 컴포넌트 외부로 이동하여 메모이제이션
function shouldShowDesignatedChip(mover: Mover): boolean {
   return !!(
      mover.hasDesignatedRequest &&
      mover.designatedEstimateStatus !== EstimateStatus.CONFIRMED &&
      mover.designatedEstimateStatus !== EstimateStatus.REJECTED
   );
}

// 상수를 컴포넌트 외부로 이동
const VALID_CHIP_TYPES: ChipType[] = [
   "SMALL",
   "HOME",
   "OFFICE",
   "DESIGNATED",
   "PENDING",
   "CONFIRMED",
];

// Query Keys
const QUERY_KEYS = {
   favoriteMovers: ['favoriteMovers'] as const,
};

// 메인 컴포넌트를 memo로 최적화
const FavoriteDriverList = memo(function FavoriteDriverList({
   onFavoriteChange,
   refreshKey,
}: FavoriteDriverListProps) {
   const t = useTranslations("FavoriteMovers");
   const router = useRouter();
   const queryClient = useQueryClient();

   const { user } = useAuth();
   const { showSuccess, showError } = useToast();

   const [isPending, startTransition] = useTransition();

   // refreshKey 변화 감지하여 데이터 새로고침 (깜빡임 방지)
   useEffect(() => {
      if (refreshKey && refreshKey > 0) {
         // 백그라운드에서 조용히 새로고침 (기존 데이터 유지하며)
         queryClient.invalidateQueries({ 
            queryKey: [...QUERY_KEYS.favoriteMovers],
            refetchType: 'active' // 활성 쿼리만 새로고침
         });
      }
   }, [refreshKey, queryClient]);

   // 계산값을 메모이제이션
   const isLoggedInAsMover = useMemo(
      () => user?.userType === "mover",
      [user?.userType],
   );

   // 인증 상태 확인
   const isAuthenticated = useMemo(() => {
      return Boolean(tokenSettings.get());
   }, []);

   // 찜한 기사님 목록 조회 쿼리
   const {
      data: favoriteMovers = [],
      isLoading,
      error,
      isError,
      refetch,
      isFetching,
      isPlaceholderData,
   } = useQuery<Mover[], Error>({
      queryKey: [...QUERY_KEYS.favoriteMovers, refreshKey],
      queryFn: async (): Promise<Mover[]> => {
         if (!isAuthenticated || isLoggedInAsMover) {
            return [];
         }

         const response = await getFavoriteMovers(1, 10);
         
         if (response?.data?.movers) {
            return response.data.movers.map((mover: Mover) => ({
               ...mover,
               isFavorite: true,
            }));
         }
         
         return [];
      },
      enabled: isAuthenticated && !isLoggedInAsMover,
      staleTime: 30 * 1000, // 30초로 단축 (더 빠른 동기화)
      gcTime: 5 * 60 * 1000, // 5분
      placeholderData: (previousData) => previousData, // 깜빡임 방지 - 이전 데이터 유지
      notifyOnChangeProps: ['data', 'error'], // data와 error 변화시만 리렌더링
      retry: (failureCount, error) => {
         // 인증 에러는 재시도하지 않음
         if (error instanceof Error && error.message.includes("로그인")) {
            return false;
         }
         return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
   });

   // 찜하기 토글 뮤테이션
   const toggleFavoriteMutation = useMutation<
      { moverId: string; isFavorite: boolean; favoriteCount: number },
      Error,
      string,
      { previousData?: Mover[]; moverId: string }
   >({
      mutationFn: async (moverId: string) => {
         const result = await toggleFavoriteMover(moverId);
         return { moverId, ...result };
      },
      onMutate: async (moverId: string) => {
         // 모든 관련 쿼리 취소 (깜빡임 방지)
         await queryClient.cancelQueries({ 
            queryKey: QUERY_KEYS.favoriteMovers 
         });

         // 이전 데이터 백업
         const previousData = queryClient.getQueryData<Mover[]>([...QUERY_KEYS.favoriteMovers, refreshKey]);

         // 즉시 UI에서 제거 (낙관적 업데이트)
         queryClient.setQueryData<Mover[]>(
            [...QUERY_KEYS.favoriteMovers, refreshKey],
            (old = []) => old.filter((mover) => mover.id !== moverId)
         );

         // 모든 refreshKey 변형에도 적용
         queryClient.setQueriesData(
            { queryKey: QUERY_KEYS.favoriteMovers },
            (old: Mover[] | undefined) => {
               if (!old) return [];
               return old.filter((mover) => mover.id !== moverId);
            }
         );

         return { previousData, moverId };
      },
      onSuccess: (result) => {
         // 성공 시 부모 컴포넌트에 알림
         onFavoriteChange?.(
            result.moverId,
            result.isFavorite,
            result.favoriteCount || 0,
         );

         showSuccess(t("removeSuccess"));
      },
      onError: (error, moverId, context) => {
         // 에러 시 이전 상태로 롤백
         if (context?.previousData) {
            queryClient.setQueryData<Mover[]>(
               [...QUERY_KEYS.favoriteMovers, refreshKey],
               context.previousData
            );
         }

         console.error("찜 토글 실패:", error);
         showError(t("toggleError"));
      },
      onSettled: () => {
         // 백그라운드에서 데이터 동기화
         setTimeout(() => {
            queryClient.invalidateQueries({ 
               queryKey: QUERY_KEYS.favoriteMovers 
            });
         }, 50); // 빠른 동기화
      },
   });

   // 찜하기 토글 핸들러
   const handleFavoriteToggle = useCallback(
      async (e: React.MouseEvent, moverId: string) => {
         e.stopPropagation();
         toggleFavoriteMutation.mutate(moverId);
      },
      [toggleFavoriteMutation],
   );

   // 카드 클릭 핸들러
   const handleCardClick = useCallback(
      (moverId: string) => {
         startTransition(() => {
            router.push(`/mover-search/${moverId}`);
         });
      },
      [router],
   );

   // 표시할 기사 목록을 메모이제이션 (애니메이션을 위한 추가 정보 포함)
   const displayMovers = useMemo(
      () => favoriteMovers.slice(0, 3),
      [favoriteMovers],
   );

   // 새로 추가된 아이템 감지 (애니메이션용)
   const [prevMoversIds, setPrevMoversIds] = useState<string[]>([]);
   const [newlyAdded, setNewlyAdded] = useState<Set<string>>(new Set());

   useEffect(() => {
      const currentIds = displayMovers.map(m => m.id);
      const newIds = currentIds.filter(id => !prevMoversIds.includes(id));
      
      if (newIds.length > 0) {
         setNewlyAdded(new Set(newIds));
         // 1초 후 애니메이션 클래스 제거
         setTimeout(() => setNewlyAdded(new Set()), 1000);
      }
      
      setPrevMoversIds(currentIds);
   }, [displayMovers, prevMoversIds]);

   // 조건부 렌더링
   if (!isAuthenticated || isLoggedInAsMover) {
      return null;
   }

   // 에러 상태
   if (isError && !isPlaceholderData) {
      const errorMessage = error instanceof Error && error.message.includes("로그인") 
         ? t("loginRequired") 
         : t("loadFailed");

      return (
         <div className="mt-8 flex flex-col gap-4 rounded-lg">
            <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
               {t("title")}
            </h2>
            <div className="flex flex-col items-center justify-center gap-3 py-8">
               <div className="text-14-medium text-red-500">{errorMessage}</div>
               <button
                  onClick={() => refetch()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
               >
                  {t("retry", { defaultValue: "다시 시도" })}
               </button>
            </div>
         </div>
      );
   }

   // 데이터가 없는 상태 또는 로딩 중일 때 스켈레톤 표시
   if (favoriteMovers.length === 0 && (isLoading || isFetching)) {
      return null; // Suspense가 스켈레톤을 처리
   }

   // 데이터가 없는 상태 (로딩 완료 후)
   if (favoriteMovers.length === 0 && !isLoading && !isFetching) {
      return (
         <div className="mt-8 flex flex-col gap-4 rounded-lg">
            <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
               {t("title")}
            </h2>
            <div className="flex items-center justify-center py-8">
               <div className="text-14-medium text-gray-500">
                  {t("noFavorites")}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
         <div className="flex items-center justify-between border-b border-b-gray-100 pb-5">
            <h2 className="text-18-semibold">{t("title")}</h2>
            
            {/* 백그라운드 새로고침 인디케이터 */}
            {isFetching && isPlaceholderData && (
               <div className="flex items-center gap-1">
                  <div className="h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent"></div>
                  <span className="text-xs text-gray-500">업데이트 중...</span>
               </div>
            )}
         </div>

         <div className={`transition-opacity duration-200`}>
            {displayMovers.map((mover: Mover) => {
               const isNewlyAdded = newlyAdded.has(mover.id);
               
               return (
                  <div
                     key={mover.id}
                     onClick={() => handleCardClick(mover.id)}
                     className={`border-line-100 relative flex cursor-pointer flex-col gap-2 rounded-lg border bg-white p-3 mb-4 transition-all duration-500 hover:shadow-md ${
                        isPending ? "opacity-75" : ""
                     } ${
                        isNewlyAdded 
                           ? "animate-fadeInUp transform-gpu" 
                           : ""
                     }`}
                     style={{
                        animation: isNewlyAdded 
                           ? 'fadeInUp 0.5s ease-out forwards' 
                           : undefined
                     }}
                  >
                  {/* 로딩 인디케이터 제거 - 즉각적인 반응을 위해 */}
                  {/* {(isPending || toggleFavoriteMutation.isPending) && (
                     <div className="absolute top-2 right-2 z-10">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                     </div>
                  )} */}

                  <div className="flex gap-1">
                     {mover.serviceType?.map((type: string, index: number) => {
                        const chipType = type.toUpperCase() as ChipType;

                        if (VALID_CHIP_TYPES.includes(chipType)) {
                           return (
                              <MoveChip key={index} type={chipType} mini={false} />
                           );
                        }
                        return null;
                     })}

                     {/* DESIGNATED 칩 로직 */}
                     {shouldShowDesignatedChip(mover) && (
                        <MoveChip type="DESIGNATED" mini={false} />
                     )}
                  </div>

                  {mover.description && (
                     <p className="text-14-medium line-clamp-2 text-gray-700">
                        {mover.description}
                     </p>
                  )}

                  <MoverProfile
                     profileImage={mover.profileImage}
                     forceMobileStyle={true}
                     big={false}
                     isLiked={true}
                     handleLikedClick={(e) => handleFavoriteToggle(e, mover.id)}
                     nickName={mover.nickName || " "}
                     favoriteCount={mover.favoriteCount || 0}
                     averageReviewRating={mover.averageReviewRating || 0}
                     reviewCount={mover.reviewCount || 0}
                     career={Number(mover.career) || 0}
                     estimateCount={mover.estimateCount || 0}
                     showHeart={true}
                  />
               </div>
            )})}
         </div>
      </div>
   );
});

export default FavoriteDriverList;