import React, { useState, useEffect, useRef } from "react";
import { calculateDistance } from "@/lib/utils";
import { getAddressSuggestions } from "@/lib/api/estimate-calculator/requests/geocodeAddress";
import { AddressSuggestion } from "@/lib/types";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface AddressInputProps {
   fromAddress: string;
   toAddress: string;
   distance: number;
   onAddressChange: (field: "fromAddress" | "toAddress", value: string) => void;
   onDistanceChange: (distance: number) => void;
}

export default function AddressInput({
   fromAddress,
   toAddress,
   distance,
   onAddressChange,
   onDistanceChange,
}: AddressInputProps) {
   const [fromSuggestions, setFromSuggestions] = useState<AddressSuggestion[]>(
      [],
   );
   const [toSuggestions, setToSuggestions] = useState<AddressSuggestion[]>([]);
   const [showFromSuggestions, setShowFromSuggestions] = useState(false);
   const [showToSuggestions, setShowToSuggestions] = useState(false);
   const [localIsCalculating, setLocalIsCalculating] = useState(false);
   const [fromSelectedIndex, setFromSelectedIndex] = useState(-1);
   const [toSelectedIndex, setToSelectedIndex] = useState(-1);
   const fromInputRef = useRef<HTMLInputElement>(null);
   const toInputRef = useRef<HTMLInputElement>(null);

   // 주소 자동완성
   const handleAddressInput = async (
      field: "fromAddress" | "toAddress",
      value: string,
   ) => {
      onAddressChange(field, value);

      if (value.length < 2 || value.length > 50) {
         const isFrom = field === "fromAddress";
         if (isFrom) {
            setShowFromSuggestions(false);
            setFromSuggestions([]);
         } else {
            setShowToSuggestions(false);
            setToSuggestions([]);
         }
         return;
      }

      try {
         const suggestions = await getAddressSuggestions(value);
         const isFrom = field === "fromAddress";

         if (isFrom) {
            setFromSuggestions(suggestions);
            setShowFromSuggestions(suggestions.length > 0);
            setShowToSuggestions(false);
            setFromSelectedIndex(-1);
         } else {
            setToSuggestions(suggestions);
            setShowToSuggestions(suggestions.length > 0);
            setShowFromSuggestions(false);
            setToSelectedIndex(-1);
         }
      } catch {
         const isFrom = field === "fromAddress";
         if (isFrom) {
            setShowFromSuggestions(false);
            setFromSuggestions([]);
         } else {
            setShowToSuggestions(false);
            setToSuggestions([]);
         }
      }
   };

   // 키보드 네비게이션
   const handleKeyDown = (
      field: "fromAddress" | "toAddress",
      e: React.KeyboardEvent<HTMLInputElement>,
   ) => {
      const suggestions =
         field === "fromAddress" ? fromSuggestions : toSuggestions;
      const selectedIndex =
         field === "fromAddress" ? fromSelectedIndex : toSelectedIndex;
      const setSelectedIndex =
         field === "fromAddress" ? setFromSelectedIndex : setToSelectedIndex;
      const setShowSuggestions =
         field === "fromAddress"
            ? setShowFromSuggestions
            : setShowToSuggestions;

      if (!suggestions.length) return;

      switch (e.key) {
         case "ArrowDown":
            e.preventDefault();
            setSelectedIndex(
               selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : 0,
            );
            break;
         case "ArrowUp":
            e.preventDefault();
            setSelectedIndex(
               selectedIndex > 0 ? selectedIndex - 1 : suggestions.length - 1,
            );
            break;
         case "Enter":
            e.preventDefault();
            if (selectedIndex >= 0) {
               handleAddressSelect(field, suggestions[selectedIndex]);
            }
            break;
         case "Escape":
            setShowSuggestions(false);
            setSelectedIndex(-1);
            break;
      }
   };

   // 주소 선택
   const handleAddressSelect = (
      field: "fromAddress" | "toAddress",
      suggestion: AddressSuggestion,
   ) => {
      const fullAddress = suggestion.description;
      onAddressChange(field, fullAddress);

      const isFrom = field === "fromAddress";
      if (isFrom) {
         setShowFromSuggestions(false);
         setFromSuggestions([]);
         setFromSelectedIndex(-1);
         fromInputRef.current?.blur();
      } else {
         setShowToSuggestions(false);
         setToSuggestions([]);
         setToSelectedIndex(-1);
         toInputRef.current?.blur();
      }
   };

   // 거리 계산
   useEffect(() => {
      if (fromAddress && toAddress && fromAddress !== toAddress) {
         setLocalIsCalculating(true);

         const calculateDistanceAsync = async () => {
            try {
               const result = await calculateDistance(fromAddress, toAddress);
               onDistanceChange(result.distance);
            } catch {
               onDistanceChange(0);
            } finally {
               setLocalIsCalculating(false);
            }
         };

         const timeoutId = setTimeout(calculateDistanceAsync, 1000);
         return () => clearTimeout(timeoutId);
      } else if (fromAddress && toAddress && fromAddress === toAddress) {
         onDistanceChange(0);
         setLocalIsCalculating(false);
      } else {
         setLocalIsCalculating(false);
      }
   }, [fromAddress, toAddress, onDistanceChange]);

   const shouldShowCalculating =
      localIsCalculating &&
      fromAddress &&
      toAddress &&
      fromAddress !== toAddress;

   return (
      <section>
         <div className="mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="h-5 w-5" />
            <h2 className="text-18-semibold">출발지/도착지</h2>
         </div>

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
               <label className="text-14-medium mb-2 block text-gray-700">
                  출발지
               </label>
               <input
                  type="text"
                  value={fromAddress}
                  onChange={(e) =>
                     handleAddressInput("fromAddress", e.target.value)
                  }
                  onFocus={() => setShowFromSuggestions(true)}
                  onKeyDown={(e) => handleKeyDown("fromAddress", e)}
                  ref={fromInputRef}
                  placeholder="예: 서울특별시 강남구 테헤란로 123"
                  className="text-14-regular focus:border-primary-blue-300 border-line-200 w-full rounded-xl border p-3"
               />
               {fromAddress && (
                  <button
                     onClick={() => handleAddressInput("fromAddress", "")}
                     className="absolute right-3 self-center text-gray-400"
                  >
                     <IoCloseOutline />
                  </button>
               )}
               {showFromSuggestions && fromSuggestions.length > 0 && (
                  <div className="border-line-200 absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg">
                     {fromSuggestions.map((suggestion, index) => (
                        <button
                           key={index}
                           onClick={() =>
                              handleAddressSelect("fromAddress", suggestion)
                           }
                           className={`text-14-regular border-line-200 hover:bg-primary-blue-50 w-full border-b-1 px-3 py-1 text-left ${
                              index === fromSelectedIndex
                                 ? "bg-primary-blue-50 text-primary-blue-700"
                                 : ""
                           }`}
                        >
                           <div className="font-medium text-gray-900">
                              {suggestion.description}
                           </div>
                        </button>
                     ))}
                  </div>
               )}
            </div>

            <div className="relative">
               <label className="text-14-medium mb-2 block text-gray-700">
                  도착지
               </label>
               <input
                  type="text"
                  value={toAddress}
                  onChange={(e) =>
                     handleAddressInput("toAddress", e.target.value)
                  }
                  onFocus={() => setShowToSuggestions(true)}
                  onKeyDown={(e) => handleKeyDown("toAddress", e)}
                  ref={toInputRef}
                  placeholder="예: 서울특별시 마포구 월드컵로 456"
                  className="text-14-regular focus:border-primary-blue-300 border-line-200 w-full rounded-xl border p-3"
               />
               {toAddress && (
                  <button
                     onClick={() => handleAddressInput("toAddress", "")}
                     className="absolute right-3 self-center text-gray-400"
                  >
                     <IoCloseOutline />
                  </button>
               )}

               {showToSuggestions && toSuggestions.length > 0 && (
                  <div className="border-line-200 absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-white shadow-lg">
                     {toSuggestions.map((suggestion, index) => (
                        <button
                           key={index}
                           onClick={() =>
                              handleAddressSelect("toAddress", suggestion)
                           }
                           className={`text-14-regular border-line-200 hover:bg-primary-blue-50 w-full border-b-1 px-3 py-1 text-left ${
                              index === toSelectedIndex
                                 ? "bg-primary-blue-50 text-primary-blue-700"
                                 : ""
                           }`}
                        >
                           <div className="font-medium text-gray-900">
                              {suggestion.description}
                           </div>
                        </button>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {shouldShowCalculating && (
            <div className="text-primary-blue-300 mt-4 ml-1 flex items-center gap-2">
               <AiOutlineLoading3Quarters className="h-3 w-3 animate-spin" />
               <span className="text-14-regular">
                  거리를 계산하고 있습니다...
               </span>
            </div>
         )}

         {distance > 0 && !shouldShowCalculating && (
            <div className="bg-primary-blue-50 mt-4 flex items-center gap-2 rounded-lg p-3">
               <span className="text-14-regular text-primary-blue-300">
                  <strong>예상 거리:</strong> 약 {distance.toFixed(1)}km
               </span>
            </div>
         )}
      </section>
   );
}
