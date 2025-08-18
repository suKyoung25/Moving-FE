"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Navigation, Search, MapPin, Star } from "lucide-react";
import { Mover } from "@/lib/types/auth.types";
import { getMovers } from "@/lib/api/mover/getMover";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface MapModalProps {
   isOpen: boolean;
   onClose: () => void;
   onMoverSelect?: (mover: Mover) => void;
   initialLocation?: { lat: number; lng: number };
}

declare global {
   interface Window {
      kakao: any;
   }
}

// 기본 지역 좌표 (검색 실패 시 fallback용)
const DEFAULT_COORDINATES: Record<string, { lat: number; lng: number }> = {
   // 한글 지역명
   서울: { lat: 37.5665, lng: 126.978 },
   인천: { lat: 37.4563, lng: 126.7052 },
   대전: { lat: 36.3504, lng: 127.3845 },
   대구: { lat: 35.8714, lng: 128.6014 },
   광주: { lat: 35.1595, lng: 126.8526 },
   부산: { lat: 35.1796, lng: 129.0756 },
   울산: { lat: 35.5384, lng: 129.3114 },
   세종: { lat: 36.48, lng: 127.289 },
   경기: { lat: 37.4138, lng: 127.5183 },
   강원: { lat: 37.8228, lng: 128.1555 },
   충북: { lat: 36.8, lng: 127.7 },
   충남: { lat: 36.5, lng: 126.8 },
   전북: { lat: 35.7175, lng: 127.153 },
   전남: { lat: 34.8679, lng: 126.991 },
   경북: { lat: 36.4919, lng: 128.888 },
   경남: { lat: 35.4606, lng: 128.2132 },
   제주: { lat: 33.4996, lng: 126.5312 },
   // 영어 코드 (동일한 좌표)
   seoul: { lat: 37.5665, lng: 126.978 },
   incheon: { lat: 37.4563, lng: 126.7052 },
   daejeon: { lat: 36.3504, lng: 127.3845 },
   daegu: { lat: 35.8714, lng: 128.6014 },
   gwangju: { lat: 35.1595, lng: 126.8526 },
   busan: { lat: 35.1796, lng: 129.0756 },
   ulsan: { lat: 35.5384, lng: 129.3114 },
   sejong: { lat: 36.48, lng: 127.289 },
   gyeonggi: { lat: 37.4138, lng: 127.5183 },
   gangwon: { lat: 37.8228, lng: 128.1555 },
   chungbuk: { lat: 36.8, lng: 127.7 },
   chungnam: { lat: 36.5, lng: 126.8 },
   jeonbuk: { lat: 35.7175, lng: 127.153 },
   jeonnam: { lat: 34.8679, lng: 126.991 },
   gyeongbuk: { lat: 36.4919, lng: 128.888 },
   gyeongnam: { lat: 35.4606, lng: 128.2132 },
   jeju: { lat: 33.4996, lng: 126.5312 },
};

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

export default function KakaoMapModal({
   isOpen,
   onClose,
   onMoverSelect,
   initialLocation,
}: MapModalProps) {
   const t = useTranslations("MoverSearch.map");
   const router = useRouter();

   const mapRef = useRef<HTMLDivElement>(null);
   const mapInstanceRef = useRef<any>(null);
   const geocoderRef = useRef<any>(null);
   const markersRef = useRef<any[]>([]);
   const infoWindowRef = useRef<any>(null);

   const [selectedMover, setSelectedMover] = useState<Mover | null>(null);
   const [searchQuery, setSearchQuery] = useState("");
   const [movers, setMovers] = useState<Mover[]>([]);
   const [filteredMovers, setFilteredMovers] = useState<Mover[]>([]);
   const [loading, setLoading] = useState(false);
   const [mapLoaded, setMapLoaded] = useState(false);
   const [mapError, setMapError] = useState<string | null>(null);
   const [mapCenter, setMapCenter] = useState(
      initialLocation || { lat: 37.5665, lng: 126.978 },
   );

   const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

   // 카카오맵 스크립트 로드
   const loadKakaoMapScript = useCallback(() => {
      return new Promise<void>((resolve, reject) => {
         if (!KAKAO_API_KEY) {
            const error =
               "NEXT_PUBLIC_KAKAO_MAP_KEY 환경변수가 설정되지 않았습니다.";
            setMapError(error);
            reject(new Error(error));
            return;
         }

         if (window.kakao && window.kakao.maps) {
            resolve();
            return;
         }

         const existingScript = document.querySelector(
            'script[src*="dapi.kakao.com"]',
         );
         if (existingScript) existingScript.remove();

         const script = document.createElement("script");
         script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`;
         script.async = true;

         script.onload = () => {
            if (window.kakao && window.kakao.maps) {
               window.kakao.maps.load(() => {
                  setMapError(null);
                  resolve();
               });
            } else {
               const error = "카카오맵 객체를 찾을 수 없습니다.";
               setMapError(error);
               reject(new Error(error));
            }
         };

         script.onerror = () => {
            const error = "카카오맵 스크립트 로드에 실패했습니다.";
            setMapError(error);
            reject(new Error(error));
         };

         document.head.appendChild(script);
      });
   }, [KAKAO_API_KEY]);

   // 지도 초기화
   const initializeMap = useCallback(async () => {
      if (!mapRef.current || !window.kakao?.maps) return;

      try {
         const mapOption = {
            center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
            level: 5,
         };

         const map = new window.kakao.maps.Map(mapRef.current, mapOption);
         mapInstanceRef.current = map;

         // 주소 검색을 위한 geocoder 초기화
         geocoderRef.current = new window.kakao.maps.services.Geocoder();

         setMapLoaded(true);

         // 지도 클릭 시 정보창 닫기
         window.kakao.maps.event.addListener(map, "click", () => {
            if (infoWindowRef.current) {
               infoWindowRef.current.close();
            }
            setSelectedMover(null);
         });

         // 지도 중심 변경 시 기사님 목록 업데이트
         window.kakao.maps.event.addListener(map, "center_changed", () => {
            const center = map.getCenter();
            const newCenter = {
               lat: center.getLat(),
               lng: center.getLng(),
            };
            setMapCenter(newCenter);
         });
      } catch (error) {
         console.error("지도 초기화 실패:", error);
         setMapError("지도 초기화에 실패했습니다.");
      }
   }, [mapCenter]);

   // 위치 기반으로 기사님 목록 로드 (위도, 경도, 반경 기반 검색)
   const loadMoversForLocation = useCallback(
      async (latitude: number, longitude: number, searchTerm?: string) => {
         setLoading(true);

         try {
            console.log("위치 기반 기사님 검색:", {
               latitude,
               longitude,
               searchTerm,
            });

            const response = await getMovers(
               {
                  page: 1,
                  limit: 100,
                  latitude,
                  longitude,
                  radius: 10, // 10km 반경
                  search: searchTerm || undefined,
                  sortBy: "distance", // 지도 모달에서만 내부적으로 사용 (UI 정렬 옵션에는 노출되지 않음)
               },
               false,
               "ko",
            );

            console.log("API 응답:", response);

            if (response && response.movers) {
               setMovers(response.movers);
               setFilteredMovers(response.movers);

               if (mapLoaded && mapInstanceRef.current) {
                  clearMarkers();
                  createMarkersForMovers(response.movers);
               }
            } else {
               setMovers([]);
               setFilteredMovers([]);
            }
         } catch (error) {
            console.error("기사 목록 로드 실패:", error);
            setMovers([]);
            setFilteredMovers([]);
         } finally {
            setLoading(false);
         }
      },
      [mapLoaded],
   );

   // 마커 생성 (위치 정보가 있는 기사님들만)
   const createMarkersForMovers = useCallback((moversData: Mover[]) => {
      if (!mapInstanceRef.current || !window.kakao?.maps) return;

      console.log("마커 생성 시작:", moversData.length, "개");

      moversData.forEach((mover) => {
         // 백엔드에서 latitude, longitude가 있는 기사님만 표시
         if (mover.latitude && mover.longitude) {
            const markerPosition = new window.kakao.maps.LatLng(
               mover.latitude,
               mover.longitude,
            );

            // 커스텀 마커 이미지 생성
            const imageSrc =
               "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";
            const imageSize = new window.kakao.maps.Size(64, 69);
            const imageOption = { offset: new window.kakao.maps.Point(27, 69) };
            const markerImage = new window.kakao.maps.MarkerImage(
               imageSrc,
               imageSize,
               imageOption,
            );

            const marker = new window.kakao.maps.Marker({
               position: markerPosition,
               image: markerImage,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
               setSelectedMover(mover);
               showInfoWindow(marker, mover);
            });

            marker.setMap(mapInstanceRef.current);
            markersRef.current.push(marker);
         }
      });

      console.log("마커 생성 완료:", markersRef.current.length, "개");
   }, []);

   // 정보창 표시
   const showInfoWindow = useCallback((marker: any, mover: Mover) => {
      if (!window.kakao?.maps) return;

      const serviceAreaText = getServiceAreaText(mover.serviceArea);

      const content = `
      <div style="padding: 12px; min-width: 220px; max-width: 300px;">
        <div style="font-weight: bold; margin-bottom: 6px; font-size: 14px;">${mover.nickName || "기사님"}</div>
        <div style="color: #666; font-size: 12px; margin-bottom: 6px;">
          서비스 지역: ${serviceAreaText || " "}
        </div>
        <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 6px;">
          <span style="color: #ffb400;">★</span>
          <span style="font-size: 12px;">${mover.averageReviewRating || 0}</span>
          <span style="color: #999; font-size: 12px;">(리뷰 ${mover.reviewCount || 0}개)</span>
        </div>
        ${mover.distance ? `<div style="font-size: 11px; color: #007bff; margin-bottom: 6px;">거리: ${mover.distance.toFixed(1)}km</div>` : ""}
        <div style="font-size: 11px; color: #666; line-height: 1.4; margin-bottom: 8px;">
          ${mover.introduction || " "}
        </div>
        <div style="font-size: 10px; color: #888;">
          경력 ${mover.career || 0}년 | 찜 ${mover.favoriteCount || 0}개
        </div>
      </div>
    `;

      if (infoWindowRef.current) {
         infoWindowRef.current.close();
      }

      const infoWindow = new window.kakao.maps.InfoWindow({
         content: content,
         removable: true,
      });

      infoWindow.open(mapInstanceRef.current, marker);
      infoWindowRef.current = infoWindow;
   }, []);

   // 마커 제거
   const clearMarkers = useCallback(() => {
      markersRef.current.forEach((marker) => {
         marker.setMap(null);
      });
      markersRef.current = [];
   }, []);

   // 현재 위치 가져오기
   const getCurrentLocation = useCallback(() => {
      if (!navigator.geolocation) {
         alert("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
         return;
      }

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
         (position) => {
            const location = {
               lat: position.coords.latitude,
               lng: position.coords.longitude,
            };

            console.log("현재 위치:", location);
            setMapCenter(location);

            if (mapInstanceRef.current) {
               const moveLatLon = new window.kakao.maps.LatLng(
                  location.lat,
                  location.lng,
               );
               mapInstanceRef.current.setCenter(moveLatLon);
            }

            // 현재 위치 기반으로 기사님 검색
            loadMoversForLocation(location.lat, location.lng);
         },
         (error) => {
            console.error("위치 정보를 가져올 수 없습니다:", error);
            alert(
               "위치 정보를 가져올 수 없습니다. 브라우저 설정을 확인해주세요.",
            );
            setLoading(false);
         },
         {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
         },
      );
   }, [loadMoversForLocation]);

   // 주소 검색 및 지도 이동
   const searchLocation = useCallback(
      (searchTerm: string) => {
         if (!geocoderRef.current || !mapInstanceRef.current) return;

         // 먼저 기본 좌표에서 찾기
         const defaultCoord = DEFAULT_COORDINATES[searchTerm];
         if (defaultCoord) {
            const moveLatLon = new window.kakao.maps.LatLng(
               defaultCoord.lat,
               defaultCoord.lng,
            );
            mapInstanceRef.current.setCenter(moveLatLon);
            setMapCenter(defaultCoord);
            loadMoversForLocation(
               defaultCoord.lat,
               defaultCoord.lng,
               searchTerm,
            );
            return;
         }

         // 카카오맵 주소 검색 API 사용
         geocoderRef.current.addressSearch(
            searchTerm,
            (result: any, status: any) => {
               if (status === window.kakao.maps.services.Status.OK) {
                  const coords = {
                     lat: parseFloat(result[0].y),
                     lng: parseFloat(result[0].x),
                  };

                  const moveLatLon = new window.kakao.maps.LatLng(
                     coords.lat,
                     coords.lng,
                  );
                  mapInstanceRef.current.setCenter(moveLatLon);
                  setMapCenter(coords);

                  // 검색된 위치 기반으로 기사님 검색
                  loadMoversForLocation(coords.lat, coords.lng, searchTerm);

                  console.log("주소 검색 성공:", searchTerm, coords);
               } else {
                  console.log("주소 검색 실패:", searchTerm);
                  // 검색 실패 시 현재 위치 기반으로 검색
                  loadMoversForLocation(
                     mapCenter.lat,
                     mapCenter.lng,
                     searchTerm,
                  );
               }
            },
         );
      },
      [mapCenter, loadMoversForLocation],
   );

   // 검색어 변경 핸들러
   const handleSearchSubmit = useCallback(
      (e: React.FormEvent) => {
         e.preventDefault();
         if (searchQuery.trim()) {
            searchLocation(searchQuery.trim());
         }
      },
      [searchQuery, searchLocation],
   );

   // 검색 필터링 (로컬 필터링)
   useEffect(() => {
      if (searchQuery.trim() === "") {
         setFilteredMovers(movers);
      } else {
         const filtered = movers.filter((mover) => {
            const nameMatch =
               mover.nickName
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) || false;
            const areaMatch = getServiceAreaText(mover.serviceArea)
               .toLowerCase()
               .includes(searchQuery.toLowerCase());
            return nameMatch || areaMatch;
         });
         setFilteredMovers(filtered);
      }
   }, [searchQuery, movers]);

   // 모달이 열릴 때 지도 초기화
   useEffect(() => {
      if (!isOpen) return;

      const initMap = async () => {
         try {
            console.log("지도 로드 시작");
            setMapError(null);

            await loadKakaoMapScript();

            setTimeout(async () => {
               await initializeMap();
               setTimeout(() => {
                  // 초기 위치 기반으로 기사님 로드
                  loadMoversForLocation(mapCenter.lat, mapCenter.lng);
               }, 500);
            }, 100);
         } catch (error) {
            console.error("지도 로드 실패:", error);
            setMapError(
               error instanceof Error
                  ? error.message
                  : "지도 로드에 실패했습니다.",
            );
         }
      };

      initMap();

      return () => {
         if (!isOpen) {
            clearMarkers();
            if (infoWindowRef.current) {
               infoWindowRef.current.close();
            }
            setMapLoaded(false);
            mapInstanceRef.current = null;
            geocoderRef.current = null;
         }
      };
   }, [
      isOpen,
      loadKakaoMapScript,
      initializeMap,
      loadMoversForLocation,
      mapCenter,
   ]);

   // 기사 목록이 변경될 때 마커 업데이트
   useEffect(() => {
      if (mapLoaded && mapInstanceRef.current) {
         clearMarkers();
         createMarkersForMovers(filteredMovers);
      }
   }, [filteredMovers, mapLoaded, createMarkersForMovers]);

   if (!isOpen) return null;

   const handleMoverCardClick = (mover: Mover) => {
      setSelectedMover(mover);

      if (mover.latitude && mover.longitude && mapInstanceRef.current) {
         const moveLatLon = new window.kakao.maps.LatLng(
            mover.latitude,
            mover.longitude,
         );
         mapInstanceRef.current.setCenter(moveLatLon);
      }
   };

   const handleSelectMover = () => {
      if (selectedMover) {
         router.push(`/mover-search/${selectedMover.id}`);
         onClose();
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
         <div className="relative h-[90vh] w-[95vw] max-w-6xl overflow-hidden rounded-2xl bg-white">
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
               <h2 className="text-xl font-bold">
                  {t("mapSearchTitle", { default: "내 주변 기사님 찾기" })}
               </h2>
               <button
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="닫기"
               >
                  <X className="h-6 w-6" />
               </button>
            </div>

            <div className="flex h-[calc(100%-80px)]">
               {/* 왼쪽 사이드바 */}
               <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                  <div className="space-y-4 p-4">
                     {!KAKAO_API_KEY && (
                        <div className="rounded border border-red-400 bg-red-100 px-3 py-2 text-sm text-red-700">
                           ⚠️ 카카오맵 API 키가 설정되지 않았습니다.
                        </div>
                     )}

                     {/* 검색바 - 폼으로 변경하여 엔터키 지원 */}
                     <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                           type="text"
                           placeholder="지역명을 입력하세요 (예: 강남구, 서울)"
                           className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                        />
                     </form>

                     <button
                        onClick={getCurrentLocation}
                        disabled={loading || !mapLoaded}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                        <Navigation className="h-4 w-4" />
                        {loading ? "위치 찾는 중..." : "현재 위치로 이동"}
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
                           onClick={() => handleMoverCardClick(mover)}
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
                                       alt={mover.nickName || "기사님"}
                                       className="h-12 w-12 rounded-full object-cover"
                                       onError={(e) => {
                                          const target =
                                             e.target as HTMLImageElement;
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
                                    {mover.nickName || "기사님"}
                                 </h3>
                                 <p className="mb-1 text-sm text-gray-600">
                                    {getServiceAreaText(mover.serviceArea)}
                                 </p>
                                 <div className="flex items-center gap-2 text-sm">
                                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                                    <span>
                                       {mover.averageReviewRating || 0}
                                    </span>
                                    <span className="text-gray-400">
                                       ({mover.reviewCount || 0})
                                    </span>
                                    {mover.distance && (
                                       <span className="text-blue-500">
                                          {mover.distance.toFixed(1)}km
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
                           <p>해당 지역에 기사님이 없습니다</p>
                           <p className="mt-1 text-xs">
                              다른 지역을 검색해보세요
                           </p>
                        </div>
                     )}
                  </div>
               </div>

               {/* 오른쪽 지도 영역 */}
               <div className="relative flex-1">
                  {mapError && (
                     <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                        <div className="p-8 text-center">
                           <MapPin className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                           <h3 className="mb-2 text-lg font-semibold text-gray-600">
                              지도 로드 실패
                           </h3>
                           <p className="mb-4 text-gray-500">{mapError}</p>
                           <button
                              onClick={() => window.location.reload()}
                              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                           >
                              새로고침
                           </button>
                        </div>
                     </div>
                  )}

                  {!mapLoaded && !mapError && (
                     <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                           <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                           <p className="text-gray-600">
                              지도를 불러오는 중...
                           </p>
                        </div>
                     </div>
                  )}

                  <div
                     ref={mapRef}
                     className="h-full w-full"
                     style={{ background: "#f5f5f5" }}
                  />

                  {selectedMover && mapLoaded && (
                     <div className="absolute right-4 bottom-4 left-4 rounded-lg border bg-white p-4 shadow-lg">
                        <div className="flex items-start gap-3">
                           <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                              {selectedMover.profileImage ? (
                                 <img
                                    src={selectedMover.profileImage}
                                    alt={selectedMover.nickName || "기사님"}
                                    className="h-16 w-16 rounded-full object-cover"
                                    onError={(e) => {
                                       const target =
                                          e.target as HTMLImageElement;
                                       target.style.display = "none";
                                    }}
                                 />
                              ) : (
                                 <span className="text-lg font-semibold text-white">
                                    {selectedMover.nickName?.charAt(0) || "기"}
                                 </span>
                              )}
                           </div>
                           <div className="min-w-0 flex-1">
                              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                 {selectedMover.nickName || "기사님"}
                              </h3>
                              <p className="mb-2 text-sm text-gray-600">
                                 서비스 지역:{" "}
                                 {getServiceAreaText(selectedMover.serviceArea)}
                              </p>
                              <div className="mb-2 flex items-center gap-4 text-sm">
                                 <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                                    {selectedMover.averageReviewRating || 0} (
                                    {selectedMover.reviewCount || 0}건)
                                 </span>
                                 {selectedMover.distance && (
                                    <span className="text-blue-500">
                                       거리: {selectedMover.distance.toFixed(1)}
                                       km
                                    </span>
                                 )}
                              </div>
                              {selectedMover.introduction && (
                                 <p className="mb-3 text-sm text-gray-600">
                                    {selectedMover.introduction}
                                 </p>
                              )}
                              <button
                                 onClick={handleSelectMover}
                                 className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                              >
                                 이 기사님 선택하기
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {mapLoaded && (
                     <div className="absolute top-4 right-4 rounded-lg bg-white p-2 text-sm shadow-md">
                        ✅ 지도 로드 완료
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
