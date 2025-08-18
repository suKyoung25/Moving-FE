"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Mover } from "@/lib/types/auth.types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import MapSidebar from "./MapSidebar";
import MapCanvas from "./MapCanvas";
import { useKakaoMap } from "@/lib/hooks/useKakaoMap";

interface MapModalProps {
   isOpen: boolean;
   onClose: () => void;
   onMoverSelect?: (mover: Mover) => void;
   initialLocation?: { lat: number; lng: number };
}

export default function KakaoMapModal({
   isOpen,
   onClose,
   onMoverSelect,
   initialLocation,
}: MapModalProps) {
   const router = useRouter();
   const mapRef = useRef<HTMLDivElement>(null);
   const modalRef = useRef<HTMLDivElement>(null);
   const [searchQuery, setSearchQuery] = useState("");
   const t = useTranslations("MoverSearch.map");

   const defaultLocation = initialLocation || { lat: 37.5665, lng: 126.978 };

   // 바깥 클릭시 모달 닫기
   useOutsideClick(modalRef, onClose);

   const handleMoverSelect = (mover: Mover) => {
      if (onMoverSelect) {
         onMoverSelect(mover);
      } else {
         router.push(`/mover-search/${mover.id}`);
      }
   };

   const {
      selectedMover,
      movers,
      loading,
      mapLoaded,
      mapError,
      hasApiKey,
      loadKakaoMapScript,
      initializeMap,
      getCurrentLocation,
      searchLocation,
      handleMoverCardClick,
      cleanup,
      loadMoversForLocation,
      refreshMoversData, // 새로 추가
   } = useKakaoMap(defaultLocation, handleMoverSelect);

   // 모달 초기화
   useEffect(() => {
      if (!isOpen) return;

      const initMap = async () => {
         try {
            await loadKakaoMapScript();
            setTimeout(async () => {
               if (mapRef.current) {
                  await initializeMap(mapRef.current);
                  // 원본처럼 별도로 초기 데이터 로드
                  setTimeout(async () => {
                     await loadMoversForLocation(
                        defaultLocation.lat,
                        defaultLocation.lng,
                     );
                  }, 500);
               }
            }, 100);
         } catch (error) {
            console.error("지도 로드 실패:", error);
         }
      };

      initMap();

      return cleanup;
   }, [
      isOpen,
      loadKakaoMapScript,
      initializeMap,
      loadMoversForLocation,
      cleanup,
      defaultLocation.lat,
      defaultLocation.lng,
   ]);

   // 모달이 열릴 때마다 데이터 새로고침
   useEffect(() => {
      if (isOpen && mapLoaded) {
         // 모달이 열리고 지도가 로드된 후 데이터 새로고침
         const timer = setTimeout(() => {
            refreshMoversData();
         }, 1000);

         return () => clearTimeout(timer);
      }
   }, [isOpen, mapLoaded, refreshMoversData]);

   if (!isOpen) return null;

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
         searchLocation(searchQuery.trim());
      }
   };

   const handleRefresh = () => {
      window.location.reload();
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
         <div
            ref={modalRef}
            className="relative h-[90vh] w-[95vw] max-w-6xl overflow-hidden rounded-2xl bg-white"
         >
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
               <h2 className="text-xl font-bold">
                  {t("mapSearchTitle", { default: "내 주변 기사님 찾기" })}
               </h2>
               <button
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-gray-100"
               >
                  <X className="h-6 w-6" />
               </button>
            </div>

            <div className="flex h-[calc(100%-80px)]">
               {/* 사이드바 */}
               <MapSidebar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSearchSubmit={handleSearchSubmit}
                  onCurrentLocationClick={getCurrentLocation}
                  loading={loading}
                  mapLoaded={mapLoaded}
                  movers={movers}
                  selectedMover={selectedMover}
                  onMoverCardClick={handleMoverCardClick}
                  hasApiKey={hasApiKey}
               />

               {/* 지도 영역 */}
               <MapCanvas
                  mapRef={mapRef}
                  mapError={mapError}
                  mapLoaded={mapLoaded}
                  onRefresh={handleRefresh}
               />
            </div>
         </div>
      </div>
   );
}
