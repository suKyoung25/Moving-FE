// LocationInputField.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Controller, Control, FieldError, Path } from "react-hook-form";
import { MapPin, Navigation, Search } from "lucide-react";
import Image from "next/image";
import closeIcon from "@/assets/images/xIcon.svg";
import searchIcon from "@/assets/images/searchIcon.svg";
import { loadPostcodeScript } from "@/lib/utils/address.util";
import SolidButton from "@/components/common/SolidButton";
import OutlinedButton from "@/components/common/OutlinedButton";
import ErrorText from "../auth/ErrorText";
import { useTranslations } from "next-intl";

// 카카오맵 타입 선언
declare global {
   interface Window {
      kakao: any;
   }
}

interface LocationData {
   latitude?: number;
   longitude?: number;
   address?: string;
}

interface DaumPostcodeData {
   zonecode: string;
   roadAddress: string;
   jibunAddress: string;
   autoJibunAddress: string;
   buildingName: string;
}

// 새로운 유연한 인터페이스
interface LocationInputFieldProps<T extends Record<string, any>> {
   name: Path<T>;
   text: string;
   control: Control<T>;
   error?: FieldError | { message?: string };
   labelId?: string;
   required?: boolean;
}

// 주소 검색 모달 컴포넌트
function AddressSearchModal({
   isOpen,
   onClose,
   onComplete,
}: {
   isOpen: boolean;
   onClose: () => void;
   onComplete: (
      address: string,
      coordinates?: { lat: number; lng: number },
   ) => void;
}) {
   const t = useTranslations("Profile");
   const elementRef = useRef<HTMLDivElement>(null);
   const [selectedAddr, setSelectedAddr] = useState<
      DaumPostcodeData | undefined
   >(undefined);
   const [isSelected, setIsSelected] = useState<boolean>(false);

   // 카카오맵 API로 주소를 좌표로 변환
   const getCoordinatesFromAddress = async (
      address: string,
   ): Promise<{ lat: number; lng: number } | null> => {
      return new Promise((resolve) => {
         if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, (result: any, status: any) => {
               if (
                  status === window.kakao.maps.services.Status.OK &&
                  result.length > 0
               ) {
                  resolve({
                     lat: parseFloat(result[0].y),
                     lng: parseFloat(result[0].x),
                  });
               } else {
                  resolve(null);
               }
            });
         } else {
            resolve(null);
         }
      });
   };

   // 카카오맵 스크립트 로드
   useEffect(() => {
      if (!window.kakao) {
         const script = document.createElement("script");
         script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services`;
         script.async = true;
         document.head.appendChild(script);
      }
   }, []);

   useEffect(() => {
      if (!isOpen || selectedAddr !== undefined) return;

      const load = async () => {
         await loadPostcodeScript();

         if (window.daum?.Postcode && elementRef.current) {
            const postcode = new window.daum.Postcode({
               oncomplete: (data: DaumPostcodeData) => setSelectedAddr(data),
               width: "100%",
               height: "100%",
            });

            postcode.embed(elementRef.current);
         }
      };

      load();
   }, [isOpen, selectedAddr]);

   const handleConfirm = async () => {
      if (!selectedAddr || !isSelected) return;

      const address = selectedAddr.roadAddress || selectedAddr.jibunAddress;

      // 좌표 변환 시도
      const coordinates = await getCoordinatesFromAddress(address);

      onComplete(address, coordinates || undefined);
      onClose();
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
         <div className="relative h-fit w-sm overflow-auto rounded-3xl bg-white px-4 py-6 max-sm:mx-5 lg:w-152 lg:rounded-4xl lg:px-6 lg:py-8">
            {/* 모달 헤더 */}
            <div className="mb-4 flex items-center justify-between lg:mb-6">
               <h2 className="text-18-bold lg:text-24-bold">
                  {t("selectBusinessLocation")}
               </h2>
               <button onClick={onClose} aria-label="닫기">
                  <Image
                     src={closeIcon}
                     alt="닫기"
                     className="aspect-square w-6 lg:w-8"
                  />
               </button>
            </div>

            {selectedAddr ? (
               <>
                  {/* 검색 입력창 */}
                  <div className="relative flex items-center">
                     <div className="bg-bg-200 text-14-regular lg:text-16-regular w-full rounded-2xl px-4 py-3 text-gray-400">
                        다시 검색하려면 검색 버튼을 클릭하세요
                     </div>
                     <button
                        className="absolute right-3"
                        onClick={() => setSelectedAddr(undefined)}
                        aria-label="다시 검색"
                     >
                        <Image src={searchIcon} alt="검색" />
                     </button>
                  </div>

                  <div className="mt-4 space-y-6 lg:mt-6 lg:space-y-10">
                     <div className="mt-4 space-y-3">
                        <button
                           className={`shadow-[2px_2px_10px_0px_rgba(224,224,224,0.20) border-line-100 flex w-full flex-col items-start gap-4 rounded-xl border p-4 ${
                              isSelected &&
                              "bg-primary-blue-50 border-primary-blue-300"
                           }`}
                           onClick={(e) => {
                              e.preventDefault();
                              setIsSelected((prev) => !prev);
                           }}
                        >
                           {/* 우편번호 */}
                           <p className="text-16-semibold max-lg:text-14-semibold">
                              {selectedAddr.zonecode}
                           </p>

                           {/* 도로명 주소 */}
                           <div className="flex h-full w-full gap-2 text-left break-keep">
                              <span className="bg-primary-blue-50 text-12-semibold lg:text-14-semibold flex h-6 w-11 items-center justify-center rounded-3xl px-1.5 py-0.5 text-blue-500 lg:h-7 lg:w-9">
                                 도로명
                              </span>
                              <span className="max-lg:text-sm">
                                 {`${selectedAddr.roadAddress} ${
                                    selectedAddr.buildingName
                                       ? `(${selectedAddr.buildingName})`
                                       : ""
                                 }`}
                              </span>
                           </div>

                           {/* 지번 주소 */}
                           <div className="flex h-full w-full gap-2 text-left break-keep">
                              <span className="bg-primary-blue-50 text-12-semibold lg:text-14-semibold flex h-6 w-11 items-center justify-center rounded-3xl px-1.5 py-0.5 text-blue-500 lg:h-7 lg:w-9">
                                 지번
                              </span>
                              <span className="max-lg:text-sm">
                                 {selectedAddr.jibunAddress !== ""
                                    ? selectedAddr.jibunAddress
                                    : selectedAddr.autoJibunAddress}
                              </span>
                           </div>
                        </button>
                     </div>

                     <div className="flex justify-end">
                        <SolidButton
                           onClick={handleConfirm}
                           disabled={!isSelected}
                        >
                           {t("confirmSelection")}
                        </SolidButton>
                     </div>
                  </div>
               </>
            ) : (
               <div
                  ref={elementRef}
                  className="h-100 w-full overflow-hidden"
                  aria-label="우편번호 검색 프레임"
               />
            )}
         </div>
      </div>
   );
}

// 메인 위치 입력 컴포넌트
function LocationInputField<T extends Record<string, any>>({
   name,
   text,
   control,
   error,
   labelId,
   required = false,
}: LocationInputFieldProps<T>) {
   const t = useTranslations("Profile");
   const [isModalOpen, setIsModalOpen] = useState(false);

   // 오류 메시지 추출 함수
   const getErrorMessage = (error: any): string | undefined => {
      if (!error) return undefined;
      if (typeof error === "string") return error;
      if (error.message) return error.message;
      // 중첩된 오류 객체에서 첫 번째 메시지 찾기
      if (typeof error === "object") {
         const values = Object.values(error);
         const firstMessage = values.find(
            (v) =>
               typeof v === "string" ||
               (typeof v === "object" && v && "message" in v),
         );
         if (typeof firstMessage === "string") return firstMessage;
         if (
            firstMessage &&
            typeof firstMessage === "object" &&
            "message" in firstMessage
         ) {
            return String(firstMessage.message);
         }
      }
      return undefined;
   };

   // 현재 위치 가져오기
   const getCurrentLocation = (): Promise<{
      latitude: number;
      longitude: number;
      address: string;
   }> => {
      return new Promise((resolve, reject) => {
         if (!navigator.geolocation) {
            reject(
               new Error("이 브라우저에서는 위치 서비스를 지원하지 않습니다."),
            );
            return;
         }

         navigator.geolocation.getCurrentPosition(
            async (position) => {
               const { latitude, longitude } = position.coords;

               // 카카오맵 API를 통해 주소 변환
               if (
                  window.kakao &&
                  window.kakao.maps &&
                  window.kakao.maps.services
               ) {
                  const geocoder = new window.kakao.maps.services.Geocoder();

                  geocoder.coord2Address(
                     longitude,
                     latitude,
                     (result: any, status: any) => {
                        if (
                           status === window.kakao.maps.services.Status.OK &&
                           result.length > 0
                        ) {
                           const address = result[0].address.address_name;
                           resolve({ latitude, longitude, address });
                        } else {
                           resolve({
                              latitude,
                              longitude,
                              address: `위도: ${latitude.toFixed(6)}, 경도: ${longitude.toFixed(6)}`,
                           });
                        }
                     },
                  );
               } else {
                  resolve({
                     latitude,
                     longitude,
                     address: `위도: ${latitude.toFixed(6)}, 경도: ${longitude.toFixed(6)}`,
                  });
               }
            },
            (error) => {
               reject(
                  new Error(
                     "위치 정보를 가져올 수 없습니다. 브라우저 설정을 확인해주세요.",
                  ),
               );
            },
         );
      });
   };

   return (
      <div className="flex flex-col gap-4 leading-8">
         <div className="text-16-semibold lg:text-20-semibold">
            {text}
            {!required && (
               <span className="ml-2 text-sm text-gray-400">(선택사항)</span>
            )}
            {required && <span className="ml-1 text-sm text-red-500">*</span>}
         </div>

         <Controller
            name={name}
            control={control}
            render={({ field }) => {
               const locationData = field.value as LocationData | undefined;

               return (
                  <div className="space-y-4">
                     {/* 주소 선택 버튼들 */}
                     <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
                        {/* 주소 검색 버튼 */}
                        <OutlinedButton
                           onClick={() => setIsModalOpen(true)}
                           className="flex items-center justify-center gap-2"
                        >
                           <Search className="h-4 w-4" />
                           주소 검색
                        </OutlinedButton>

                        {/* 현재 위치 버튼 */}
                        <OutlinedButton
                           onClick={async () => {
                              try {
                                 const location = await getCurrentLocation();
                                 field.onChange({
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                    address: location.address,
                                 });
                              } catch (error) {
                                 alert(
                                    error instanceof Error
                                       ? error.message
                                       : "위치를 가져올 수 없습니다.",
                                 );
                              }
                           }}
                           className="flex items-center justify-center gap-2"
                        >
                           <Navigation className="h-4 w-4" />
                           현재 위치
                        </OutlinedButton>
                     </div>

                     {/* 선택된 위치 정보 표시 */}
                     {locationData?.address && (
                        <div className="rounded-lg bg-gray-50 p-4">
                           <div className="flex items-start gap-3">
                              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                              <div className="flex-1">
                                 <p className="mb-1 font-medium text-gray-900">
                                    선택된 사업장 위치
                                 </p>
                                 <p className="mb-2 text-sm text-gray-600">
                                    {locationData.address}
                                 </p>
                                 {locationData.latitude &&
                                    locationData.longitude && (
                                       <p className="text-xs text-gray-500">
                                          위도:{" "}
                                          {locationData.latitude.toFixed(6)},
                                          경도:{" "}
                                          {locationData.longitude.toFixed(6)}
                                       </p>
                                    )}
                              </div>
                              <button
                                 type="button"
                                 onClick={() => field.onChange({})}
                                 className="text-sm text-gray-400 hover:text-gray-600"
                              >
                                 삭제
                              </button>
                           </div>
                        </div>
                     )}

                     {/* 수동 입력 필드들 (고급 사용자용) */}
                     <details className="rounded-lg border">
                        <summary className="cursor-pointer p-3 text-sm text-gray-600 hover:bg-gray-50">
                           수동으로 좌표 입력 (고급)
                        </summary>
                        <div className="space-y-3 border-t p-4">
                           <div className="grid grid-cols-2 gap-3">
                              <div>
                                 <label className="mb-1 block text-sm font-medium text-gray-700">
                                    위도
                                 </label>
                                 <input
                                    type="number"
                                    step="any"
                                    min="-90"
                                    max="90"
                                    placeholder="37.5665"
                                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    value={locationData?.latitude || ""}
                                    onChange={(e) => {
                                       const latitude = parseFloat(
                                          e.target.value,
                                       );
                                       field.onChange({
                                          ...locationData,
                                          latitude: isNaN(latitude)
                                             ? undefined
                                             : latitude,
                                       });
                                    }}
                                 />
                              </div>

                              <div>
                                 <label className="mb-1 block text-sm font-medium text-gray-700">
                                    경도
                                 </label>
                                 <input
                                    type="number"
                                    step="any"
                                    min="-180"
                                    max="180"
                                    placeholder="126.9780"
                                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    value={locationData?.longitude || ""}
                                    onChange={(e) => {
                                       const longitude = parseFloat(
                                          e.target.value,
                                       );
                                       field.onChange({
                                          ...locationData,
                                          longitude: isNaN(longitude)
                                             ? undefined
                                             : longitude,
                                       });
                                    }}
                                 />
                              </div>
                           </div>

                           <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                 주소
                              </label>
                              <input
                                 type="text"
                                 placeholder="서울특별시 중구 태평로1가 31"
                                 className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                 value={locationData?.address || ""}
                                 onChange={(e) => {
                                    field.onChange({
                                       ...locationData,
                                       address: e.target.value,
                                    });
                                 }}
                              />
                           </div>
                        </div>
                     </details>

                     {/* 주소 검색 모달 */}
                     <AddressSearchModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onComplete={(address, coordinates) => {
                           field.onChange({
                              address,
                              latitude: coordinates?.lat,
                              longitude: coordinates?.lng,
                           });
                        }}
                     />
                  </div>
               );
            }}
         />

         <ErrorText error={getErrorMessage(error)} />
      </div>
   );
}

export default LocationInputField;
