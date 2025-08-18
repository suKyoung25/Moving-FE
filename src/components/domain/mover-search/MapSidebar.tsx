"use client";

import React, { useEffect } from "react";
import { Navigation, Search, MapPin, Star } from "lucide-react";
import { Mover } from "@/lib/types/auth.types";
import { useTranslations } from "next-intl";

interface MapSidebarProps {
   searchQuery: string;
   setSearchQuery: (query: string) => void;
   onSearchSubmit: (e: React.FormEvent) => void;
   onCurrentLocationClick: () => void;
   loading: boolean;
   mapLoaded: boolean;
   movers: Mover[];
   selectedMover: Mover | null;
   onMoverCardClick: (mover: Mover) => void;
   hasApiKey: boolean;
}

const getAreaName = (area: any): string => {
   if (typeof area === "string") return area;
   if (area && typeof area === "object" && area.regionName)
      return area.regionName;
   if (area && typeof area === "object" && area.id) return area.id;
   return "";
};

const getServiceAreaText = (serviceArea: any): string => {
   if (!serviceArea || !Array.isArray(serviceArea)) return "";
   return serviceArea
      .map((area) => getAreaName(area))
      .filter(Boolean)
      .join(", ");
};

export default function MapSidebar({
   searchQuery,
   setSearchQuery,
   onSearchSubmit,
   onCurrentLocationClick,
   loading,
   mapLoaded,
   movers,
   selectedMover,
   onMoverCardClick,
   hasApiKey,
}: MapSidebarProps) {
   const t = useTranslations("MoverSearch.map");

   // 검색 필터링 로직을 컴포넌트 내부로 이동
   const filteredMovers = React.useMemo(() => {
      if (searchQuery.trim() === "") {
         return movers;
      } else {
         return movers.filter((mover) => {
            const nameMatch =
               mover.nickName
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) || false;
            const areaMatch = getServiceAreaText(mover.serviceArea)
               .toLowerCase()
               .includes(searchQuery.toLowerCase());
            return nameMatch || areaMatch;
         });
      }
   }, [searchQuery, movers]);

   return (
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50">
         <div className="space-y-4 p-4">
            {!hasApiKey && (
               <div className="rounded border border-red-400 bg-red-100 px-3 py-2 text-sm text-red-700">
                  ⚠️ {t("kakaoApiKeyMissing")}
               </div>
            )}

            <form onSubmit={onSearchSubmit} className="relative">
               <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
               <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </form>

            <button
               onClick={onCurrentLocationClick}
               disabled={loading || !mapLoaded}
               className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
               <Navigation className="h-4 w-4" />
               {loading ? t("locationSearching") : t("currentLocationBtn")}
            </button>
         </div>

         {/* 기사 목록 */}
         <div className="max-h-[calc(100%-140px)] overflow-y-auto">
            {loading && (
               <div className="flex items-center justify-center p-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
               </div>
            )}

            {filteredMovers.map((mover) => (
               <div
                  key={mover.id}
                  onClick={() => onMoverCardClick(mover)}
                  className={`cursor-pointer border-b border-gray-200 p-4 transition-colors hover:bg-white ${
                     selectedMover?.id === mover.id
                        ? "border-l-4 border-l-blue-500 bg-blue-50"
                        : ""
                  }`}
               >
                  <div className="flex items-start gap-3">
                     <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                        {mover.profileImage ? (
                           <img
                              src={mover.profileImage}
                              alt={mover.nickName || t("moverDefaultName")}
                              className="h-12 w-12 rounded-full object-cover"
                              onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.style.display = "none";
                              }}
                           />
                        ) : (
                           <span className="font-semibold text-white">
                              {mover.nickName?.charAt(0) || "기"}
                           </span>
                        )}
                     </div>
                     <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-900">
                           {mover.nickName || t("moverDefaultName")}
                        </h3>
                        <p className="mb-1 text-sm text-gray-600">
                           {getServiceAreaText(mover.serviceArea)}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                           <Star className="h-3 w-3 fill-current text-yellow-500" />
                           <span>{mover.averageReviewRating || 0}</span>
                           <span className="text-gray-400">
                              ({mover.reviewCount || 0} {t("reviewCount")})
                           </span>
                           {mover.distance && (
                              <span className="text-blue-500">
                                 {mover.distance.toFixed(1)}
                                 {t("kmUnit")}
                              </span>
                           )}
                        </div>
                        {mover.introduction && (
                           <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                              {mover.introduction}
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            ))}

            {!loading && filteredMovers.length === 0 && (
               <div className="p-8 text-center text-gray-500">
                  <MapPin className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                  <p>{t("noMoversFound")}</p>
                  <p className="mt-1 text-xs">{t("searchOtherArea")}</p>
               </div>
            )}
         </div>
      </div>
   );
}
