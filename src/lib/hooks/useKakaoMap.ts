"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Mover } from "@/lib/types/auth.types";
import { getMovers } from "@/lib/api/mover/getMover";
import { DEFAULT_COORDINATES, REGION_MAP } from "@/constants/mover.constants";

// 유틸리티 함수들
const extractAreaFromSearchTerm = (searchTerm: string): string | undefined => {
   if (!searchTerm) return undefined;

   const normalizedTerm = searchTerm.trim().toLowerCase();

   for (const [key, value] of Object.entries(REGION_MAP)) {
      if (normalizedTerm.includes(key.toLowerCase())) {
         return value;
      }
   }
   return undefined;
};

const createProfileMarkerImage = (
   profileImage: string | null,
   nickName: string | null,
): Promise<any> | any => {
   const canvas = document.createElement("canvas");
   const size = 50;
   canvas.width = size;
   canvas.height = size;
   const ctx = canvas.getContext("2d");

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

export const useKakaoMap = (
   initialLocation: { lat: number; lng: number },
   onMoverSelect: (mover: Mover) => void,
) => {
   // Refs
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
   const [movers, setMovers] = useState<Mover[]>([]);
   const [loading, setLoading] = useState(false);
   const [mapLoaded, setMapLoaded] = useState(false);
   const [mapError, setMapError] = useState<string | null>(null);
   const [mapCenter, setMapCenter] = useState(initialLocation);
   const [isSearching, setIsSearching] = useState(false);

   const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

   // 마커 제거 함수
   const clearMarkers = useCallback(() => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
   }, []);

   // 마커 생성 함수
   const createMarkersForMovers = useCallback(
      async (moversData: Mover[]) => {
         if (!mapInstanceRef.current || !window.kakao?.maps) return;

         // 기존 마커 먼저 제거
         clearMarkers();

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
                  onMoverSelect(mover);
               });

               marker.setMap(mapInstanceRef.current);
               markersRef.current.push(marker);
            }
         }
      },
      [onMoverSelect, clearMarkers],
   );

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
            } else {
               setMovers([]);
            }
         } catch (error) {
            console.error("기사 목록 로드 실패:", error);
            setMovers([]);
         } finally {
            setLoading(false);
         }
      },
      [],
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
   const initializeMap = useCallback(
      async (mapElement: HTMLDivElement) => {
         if (!mapElement || !window.kakao?.maps) return;

         try {
            const map = new window.kakao.maps.Map(mapElement, {
               center: new window.kakao.maps.LatLng(
                  mapCenter.lat,
                  mapCenter.lng,
               ),
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
      },
      [mapCenter.lat, mapCenter.lng, debouncedLocationSearch],
   );

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

   // 기사 카드 클릭 핸들러
   const handleMoverCardClick = useCallback((mover: Mover) => {
      setSelectedMover(mover);
      if (mover.latitude && mover.longitude && mapInstanceRef.current) {
         const moveLatLon = new window.kakao.maps.LatLng(
            mover.latitude,
            mover.longitude,
         );
         mapInstanceRef.current.setCenter(moveLatLon);
      }
   }, []);

   // 강제로 데이터 새로고침하는 함수
   const refreshMoversData = useCallback(async () => {
      if (mapCenter) {
         await loadMoversForLocation(mapCenter.lat, mapCenter.lng);
      }
   }, [mapCenter, loadMoversForLocation]);

   // 정리 함수
   const cleanup = useCallback(() => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (markersRef.current) {
         markersRef.current.forEach((marker) => marker.setMap(null));
      }
      if (infoWindowRef.current) infoWindowRef.current.close();
      clearMarkers();
      setMapLoaded(false);
      mapInstanceRef.current = null;
      geocoderRef.current = null;
   }, [clearMarkers]);

   // movers 데이터가 변경될 때마다 마커 업데이트
   useEffect(() => {
      const updateMarkers = async () => {
         if (mapLoaded && mapInstanceRef.current && movers.length > 0) {
            await createMarkersForMovers(movers);
         }
      };
      updateMarkers();
   }, [movers, mapLoaded, createMarkersForMovers]);

   return {
      // States
      selectedMover,
      movers,
      loading,
      mapLoaded,
      mapError,
      mapCenter,
      hasApiKey: !!KAKAO_API_KEY,

      // Functions
      loadKakaoMapScript,
      initializeMap,
      getCurrentLocation,
      searchLocation,
      handleMoverCardClick,
      cleanup,
      loadMoversForLocation,
      refreshMoversData,

      // Refs for external use
      mapInstanceRef,
   };
};
