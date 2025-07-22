import { useEffect, useRef, useState } from "react";
import closeIcon from "@/assets/images/xIcon.svg";
import Image from "next/image";
import searchIcon from "@/assets/images/searchIcon.svg";
import { loadPostcodeScript } from "@/lib/utils/address.util";
import SolidButton from "@/components/common/SolidButton";

const addrBoxClass = "flex text-left gap-2 break-keep w-full h-full";
const addrTypeClass =
   "flex justify-center items-center w-11 h-6 lg:w-[54px] lg:h-7 px-1.5 py-0.5 bg-primary-blue-50 text-blue-500 text-xs lg:text-sm font-semibold rounded-3xl";
const addrClass = "max-lg:text-sm";

export default function AddressSearch({
   type,
   onComplete,
   onClose,
}: {
   type: string | null;
   onComplete: (addr: string) => void;
   onClose: () => void;
}) {
   const elementRef = useRef<HTMLDivElement>(null);
   const [selectedAddr, setSelectedAddr] = useState<DaumPostcodeData | null>(
      null,
   );
   const [isSelected, setIsSelected] = useState<boolean>(false);

   useEffect(() => {
      if (selectedAddr !== null) return; // 주소 선택된 상태면 실행 안 함

      const load = async () => {
         await loadPostcodeScript();

         if (window.daum?.Postcode && elementRef.current) {
            const postcode = new window.daum.Postcode({
               oncomplete: (data) => setSelectedAddr(data),
               width: "100%",
               height: "100%",
            });

            postcode.embed(elementRef.current);
         }
      };

      load();
   }, [selectedAddr]);

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
         <div className="relative h-fit w-sm overflow-auto rounded-3xl bg-white px-4 py-6 max-sm:mx-5 lg:w-152 lg:rounded-4xl lg:px-6 lg:py-8">
            {/* 모달 헤더 */}
            <div className="mb-4 flex items-center justify-between lg:mb-6">
               <h2 className="text-lg font-bold lg:text-2xl">
                  {type === "from"
                     ? "출발지를 선택해주세요"
                     : "도착지를 선택해주세요"}
               </h2>
               <button onClick={onClose}>
                  <Image
                     src={closeIcon}
                     alt="모달 닫기"
                     className="aspect-square w-6 lg:w-8"
                  />
               </button>
            </div>

            {selectedAddr ? (
               <>
                  {/* 검색 입력창 */}
                  <div className="relative flex items-center">
                     <input
                        type="text"
                        className="bg-bg-200 w-full rounded-2xl px-4 py-3 text-sm lg:text-base"
                        placeholder="다시 선택하려면 검색 아이콘을 눌러주세요."
                     />
                     <button
                        className="absolute right-3"
                        onClick={() => setSelectedAddr(null)}
                     >
                        <Image src={searchIcon} alt="검색" />
                     </button>
                  </div>
                  <div className="mt-4 space-y-6 lg:mt-6 lg:space-y-10">
                     <div className="mt-4 space-y-3">
                        <button
                           className={`shadow-[2px_2px_10px_0px_rgba(224,224,224,0.20) border-line-100 flex w-full flex-col items-start gap-4 rounded-xl border p-4 ${isSelected && "bg-primary-blue-50 border-primary-blue-300"}`}
                           onClick={(e) => {
                              e.preventDefault();
                              setIsSelected((prev) => !prev);
                           }}
                        >
                           {/* 우편번호 */}
                           <p className="font-semibold max-lg:text-sm">
                              {selectedAddr.zonecode}
                           </p>

                           {/* 도로명 주소 */}
                           <div className={addrBoxClass}>
                              <span className={addrTypeClass}>도로명</span>
                              <span className={addrClass}>
                                 {`${selectedAddr.roadAddress} ${selectedAddr.buildingName ? `(${selectedAddr.buildingName})` : ""}`}
                              </span>
                           </div>

                           {/* 지번 주소 */}
                           <div className={addrBoxClass}>
                              <span className={addrTypeClass}>지번</span>
                              <span className={addrClass}>
                                 {selectedAddr.jibunAddress !== ""
                                    ? selectedAddr.jibunAddress
                                    : selectedAddr.autoJibunAddress}
                              </span>
                           </div>
                        </button>
                     </div>
                     <div className="flex justify-end">
                        <SolidButton
                           onClick={() => {
                              onComplete(selectedAddr.address);
                              onClose();
                           }}
                           disabled={!isSelected}
                        >
                           선택 완료
                        </SolidButton>
                     </div>
                  </div>
               </>
            ) : (
               <div
                  ref={elementRef}
                  className="h-[400px] w-full overflow-hidden"
               />
            )}
         </div>
      </div>
   );
}
