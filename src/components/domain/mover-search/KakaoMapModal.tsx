"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Navigation, Search, MapPin, Star } from "lucide-react";
import { Mover } from "@/lib/types/auth.types";
import { getMovers } from "@/lib/api/mover/getMover";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {} from "@/constants/mover.constants";

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

// 🔧 유틸리티 함수들을 컴포넌트 상단으로 이동
const DEFAULT_COORDINATES: Record<string, { lat: number; lng: number }> = {
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

const extractAreaFromSearchTerm = (searchTerm: string): string | undefined => {
   if (!searchTerm) return undefined;

   const normalizedTerm = searchTerm.trim().toLowerCase();
   const regionMap: Record<string, string> = {
      서울: "서울",
      서울시: "서울",
      서울특별시: "서울",
      부산: "부산",
      부산시: "부산",
      부산광역시: "부산",
      대구: "대구",
      대구시: "대구",
      대구광역시: "대구",
      인천: "인천",
      인천시: "인천",
      인천광역시: "인천",
      광주: "광주",
      광주시: "광주",
      광주광역시: "광주",
      대전: "대전",
      대전시: "대전",
      대전광역시: "대전",
      울산: "울산",
      울산시: "울산",
      울산광역시: "울산",
      세종: "세종",
      세종시: "세종",
      세종특별자치시: "세종",
      경기: "경기",
      경기도: "경기",
      강원: "강원",
      강원도: "강원",
      충북: "충북",
      충청북도: "충북",
      충남: "충남",
      충청남도: "충남",
      전북: "전북",
      전라북도: "전북",
      전북특별자치도: "전북",
      전남: "전남",
      전라남도: "전남",
      경북: "경북",
      경상북도: "경북",
      경남: "경남",
      경상남도: "경남",
      제주: "제주",
      제주도: "제주",
      제주특별자치도: "제주",
      강남구: "서울",
      서초구: "서울",
      송파구: "서울",
      강서구: "서울",
      마포구: "서울",
      종로구: "서울",
      중구: "서울",
      영등포구: "서울",
   };

   for (const [key, value] of Object.entries(regionMap)) {
      if (normalizedTerm.includes(key.toLowerCase())) {
         return value;
      }
   }
   return undefined;
};

// 🔧 프로필 마커 생성 함수 (null 체크 추가)
const createProfileMarkerImage = (
   profileImage: string | null,
   nickName: string | null,
): Promise<any> | any => {
   const canvas = document.createElement("canvas");
   const size = 50;
   canvas.width = size;
   canvas.height = size;
   const ctx = canvas.getContext("2d");

   // 🔧 null 체크 추가
   if (!ctx) {
      console.error("Canvas context를 생성할 수 없습니다.");
      return null;
   }

   const createDefaultAvatar = () => {
      if (!ctx) return;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const initial = nickName?.charAt(0) || " ";
      ctx.fillText(initial, size / 2, size / 2);
   };

   // 원형 배경 그리기
   ctx.beginPath();
   ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
   ctx.fillStyle = "#3B82F6";
   ctx.fill();
   ctx.strokeStyle = "#FFFFFF";
   ctx.lineWidth = 3;
   ctx.stroke();

   if (profileImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";

      return new Promise<any>((resolve) => {
         img.onload = () => {
            if (!ctx) return;
            ctx.save();
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(img, 2, 2, size - 4, size - 4);
            ctx.restore();

            const dataURL = canvas.toDataURL();
            const markerImage = new window.kakao.maps.MarkerImage(
               dataURL,
               new window.kakao.maps.Size(size, size),
               { offset: new window.kakao.maps.Point(size / 2, size / 2) },
            );
            resolve(markerImage);
         };

         img.onerror = () => {
            createDefaultAvatar();
            const dataURL = canvas.toDataURL();
            const markerImage = new window.kakao.maps.MarkerImage(
               dataURL,
               new window.kakao.maps.Size(size, size),
               { offset: new window.kakao.maps.Point(size / 2, size / 2) },
            );
            resolve(markerImage);
         };

         img.src = profileImage;
      });
   } else {
      createDefaultAvatar();
      const dataURL = canvas.toDataURL();
      return new window.kakao.maps.MarkerImage(
         dataURL,
         new window.kakao.maps.Size(size, size),
         { offset: new window.kakao.maps.Point(size / 2, size / 2) },
      );
   }
};

export default function KakaoMapModal({
   isOpen,
   onClose,
   onMoverSelect,
   initialLocation,
}: MapModalProps) {
   const t = useTranslations("MoverSearch.map");
   const router = useRouter();

   // Refs
   const mapRef = useRef<HTMLDivElement>(null);
   const mapInstanceRef = useRef<any>(null);
   const geocoderRef = useRef<any>(null);
   const markersRef = useRef<any[]>([]);
   const infoWindowRef = useRef<any>(null);
   const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const lastSearchPositionRef = useRef<{ lat: number; lng: number } | null>(
      null,
   );

   // States
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
   const [isSearching, setIsSearching] = useState(false);

   const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

   // 🔧 함수 선언 순서 수정 - createMarkersForMovers를 먼저 선언
   const createMarkersForMovers = useCallback(
      async (moversData: Mover[]) => {
         if (!mapInstanceRef.current || !window.kakao?.maps) return;

         for (const mover of moversData) {
            if (mover.latitude && mover.longitude) {
               const markerPosition = new window.kakao.maps.LatLng(
                  mover.latitude,
                  mover.longitude,
               );
               const markerImage = await createProfileMarkerImage(
                  mover.profileImage ?? null,
                  mover.nickName ?? null,
               );

               const marker = new window.kakao.maps.Marker({
                  position: markerPosition,
                  image: markerImage,
               });

               window.kakao.maps.event.addListener(marker, "click", () => {
                  setSelectedMover(mover);
                  router.push(`/mover-search/${mover.id}`);
               });

               marker.setMap(mapInstanceRef.current);
               markersRef.current.push(marker);
            }
         }
      },
      [router],
   );

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

         // 기존 스크립트 제거
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

   // 위치 기반 검색
   const loadMoversForLocation = useCallback(
      async (latitude: number, longitude: number, searchTerm?: string) => {
         setLoading(true);

         try {
            let areaParam: string | undefined = undefined;
            if (searchTerm) {
               areaParam = extractAreaFromSearchTerm(searchTerm);
            }

            const response = await getMovers(
               {
                  page: 1,
                  limit: 100,
                  latitude,
                  longitude,
                  radius: 10,
                  search: searchTerm || undefined,
                  area: areaParam,
                  sortBy: "distance",
               },
               false,
               "ko",
            );

            if (response && response.movers) {
               setMovers(response.movers);
               setFilteredMovers(response.movers);

               if (mapLoaded && mapInstanceRef.current) {
                  clearMarkers();
                  await createMarkersForMovers(response.movers);
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
      [mapLoaded, createMarkersForMovers],
   );

   // 디바운싱된 검색
   const debouncedLocationSearch = useCallback(
      async (latitude: number, longitude: number, searchTerm?: string) => {
         if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
         }

         const lastPos = lastSearchPositionRef.current;
         if (
            lastPos &&
            Math.abs(lastPos.lat - latitude) < 0.001 &&
            Math.abs(lastPos.lng - longitude) < 0.001
         ) {
            return;
         }

         if (isSearching) return;

         return new Promise<void>((resolve) => {
            searchTimeoutRef.current = setTimeout(async () => {
               setIsSearching(true);
               lastSearchPositionRef.current = {
                  lat: latitude,
                  lng: longitude,
               };

               await loadMoversForLocation(latitude, longitude, searchTerm);

               setTimeout(() => setIsSearching(false), 1000);
               resolve();
            }, 500);
         });
      },
      [isSearching, loadMoversForLocation],
   );

   // 지도 초기화
   const initializeMap = useCallback(async () => {
      if (!mapRef.current || !window.kakao?.maps) return;

      try {
         const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
            level: 5,
         });

         mapInstanceRef.current = map;
         geocoderRef.current = new window.kakao.maps.services.Geocoder();
         setMapLoaded(true);

         // 지도 클릭 시 정보창 닫기
         window.kakao.maps.event.addListener(map, "click", () => {
            if (infoWindowRef.current) {
               infoWindowRef.current.close();
            }
            setSelectedMover(null);
         });

         // 지도 중심 변경 이벤트
         let moveEndTimeout: NodeJS.Timeout;
         window.kakao.maps.event.addListener(map, "center_changed", () => {
            clearTimeout(moveEndTimeout);
            moveEndTimeout = setTimeout(async () => {
               const center = map.getCenter();
               const lat = center.getLat();
               const lng = center.getLng();
               setMapCenter({ lat, lng });
               await debouncedLocationSearch(lat, lng);
            }, 300);
         });
      } catch (error) {
         console.error("지도 초기화 실패:", error);
         setMapError("지도 초기화에 실패했습니다.");
      }
   }, [mapCenter, debouncedLocationSearch]);

   // 마커 제거
   const clearMarkers = useCallback(() => {
      markersRef.current.forEach((marker) => marker.setMap(null));
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
         async (position) => {
            const location = {
               lat: position.coords.latitude,
               lng: position.coords.longitude,
            };
            setMapCenter(location);

            if (mapInstanceRef.current) {
               const moveLatLon = new window.kakao.maps.LatLng(
                  location.lat,
                  location.lng,
               );
               mapInstanceRef.current.setCenter(moveLatLon);
            }

            await loadMoversForLocation(location.lat, location.lng);
         },
         (error) => {
            console.error("위치 정보를 가져올 수 없습니다:", error);
            alert(
               "위치 정보를 가져올 수 없습니다. 브라우저 설정을 확인해주세요.",
            );
            setLoading(false);
         },
         { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
   }, [loadMoversForLocation]);

   // 주소 검색
   const searchLocation = useCallback(
      async (searchTerm: string) => {
         if (!geocoderRef.current || !mapInstanceRef.current) return;

         const defaultCoord = DEFAULT_COORDINATES[searchTerm];
         if (defaultCoord) {
            const moveLatLon = new window.kakao.maps.LatLng(
               defaultCoord.lat,
               defaultCoord.lng,
            );
            mapInstanceRef.current.setCenter(moveLatLon);
            setMapCenter(defaultCoord);
            await loadMoversForLocation(
               defaultCoord.lat,
               defaultCoord.lng,
               searchTerm,
            );
            return;
         }

         geocoderRef.current.addressSearch(
            searchTerm,
            async (result: any, status: any) => {
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
                  await loadMoversForLocation(
                     coords.lat,
                     coords.lng,
                     searchTerm,
                  );
               }
            },
         );
      },
      [loadMoversForLocation],
   );

   // 검색 필터링
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

   // 모달 초기화
   useEffect(() => {
      if (!isOpen) return;

      const initMap = async () => {
         try {
            setMapError(null);
            await loadKakaoMapScript();
            setTimeout(async () => {
               await initializeMap();
               setTimeout(async () => {
                  await loadMoversForLocation(mapCenter.lat, mapCenter.lng);
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
         clearMarkers();
         if (infoWindowRef.current) infoWindowRef.current.close();
         if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
         setMapLoaded(false);
         mapInstanceRef.current = null;
         geocoderRef.current = null;
      };
   }, [
      isOpen,
      loadKakaoMapScript,
      initializeMap,
      loadMoversForLocation,
      mapCenter,
   ]);

   // 마커 업데이트
   useEffect(() => {
      const updateMarkers = async () => {
         if (mapLoaded && mapInstanceRef.current) {
            clearMarkers();
            await createMarkersForMovers(filteredMovers);
         }
      };
      updateMarkers();
   }, [filteredMovers, mapLoaded, createMarkersForMovers]);

   // 정리
   useEffect(() => {
      return () => {
         if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
         if (markersRef.current) {
            markersRef.current.forEach((marker) => marker.setMap(null));
         }
         mapInstanceRef.current = null;
      };
   }, []);

   if (!isOpen) return null;

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
         searchLocation(searchQuery.trim());
      }
   };

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
               >
                  <X className="h-6 w-6" />
               </button>
            </div>

            <div className="flex h-[calc(100%-80px)]">
               {/* 사이드바 */}
               <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50">
                  <div className="space-y-4 p-4">
                     {!KAKAO_API_KEY && (
                        <div className="rounded border border-red-400 bg-red-100 px-3 py-2 text-sm text-red-700">
                           ⚠️ 카카오맵 API 키가 설정되지 않았습니다.
                        </div>
                     )}

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

               {/* 지도 영역 */}
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
