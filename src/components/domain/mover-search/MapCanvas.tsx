"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface MapCanvasProps {
   mapRef: React.RefObject<HTMLDivElement | null>;
   mapError: string | null;
   mapLoaded: boolean;
   onRefresh: () => void;
}

export default function MapCanvas({
   mapRef,
   mapError,
   mapLoaded,
   onRefresh,
}: MapCanvasProps) {
   const t = useTranslations("MoverSearch.map");

   return (
      <div className="relative flex-1">
         {mapError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
               <div className="p-8 text-center">
                  <MapPin className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-600">
                     {t("mapLoadFailed")}
                  </h3>
                  <p className="mb-4 text-gray-500">
                     {mapError || t("mapLoadFailedDesc")}
                  </p>
                  <button
                     onClick={onRefresh}
                     className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                     {t("refreshBtn")}
                  </button>
               </div>
            </div>
         )}

         {!mapLoaded && !mapError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
               <div className="text-center">
                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <p className="text-gray-600">{t("mapLoading")}</p>
               </div>
            </div>
         )}

         <div
            ref={mapRef}
            className="h-full w-full"
            style={{ background: "#f5f5f5" }}
         />

         {mapLoaded && (
            <div className="absolute top-4 right-4 rounded-lg bg-white p-2 text-sm shadow-md">
               ✅ {t("mapLoadComplete")}
            </div>
         )}
      </div>
   );
}
