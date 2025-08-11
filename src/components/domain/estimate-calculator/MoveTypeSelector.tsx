import React from "react";
import { MoveTypeOption } from "@/lib/types";
import { FaTruck } from "react-icons/fa6";
import { moveTypeLabels } from "@/lib/utils";

interface MoveTypeSelectorProps {
   selected: string;
   onTypeSelect: (type: "SMALL" | "HOME" | "OFFICE") => void;
}

export default function MoveTypeSelector({
   selected,
   onTypeSelect,
}: MoveTypeSelectorProps) {
   const moveTypes: MoveTypeOption[] = [
      {
         moveType: "SMALL",
         label: moveTypeLabels.SMALL,
         desc: "원룸, 투룸, 20평대 미만",
         price: "4만원~",
      },
      {
         moveType: "HOME",
         label: moveTypeLabels.HOME,
         desc: "쓰리룸, 20평대 이상",
         price: "8만원~",
      },
      {
         moveType: "OFFICE",
         label: moveTypeLabels.OFFICE,
         desc: "사무실, 상업공간",
         price: "10만원~",
      },
   ];

   return (
      <section>
         <div className="mb-4 flex items-center gap-2">
            <FaTruck className="h-5 w-5" />
            <h2 className="text-18-semibold">이사 유형</h2>
         </div>

         <div className="grid grid-cols-3 gap-3">
            {moveTypes.map((type) => (
               <button
                  key={type.moveType}
                  type="button"
                  onClick={() => onTypeSelect(type.moveType)}
                  className={`w-full space-y-1 rounded-2xl border py-4 break-keep ${
                     selected === type.moveType
                        ? "border-primary-blue-300 bg-primary-blue-50 text-primary-blue-700"
                        : "border-line-200 hover:bg-gray-50"
                  }`}
               >
                  <h3 className="text-14-semibold">{type.label}</h3>
                  <p className="text-black-400 text-12-regular">{type.desc}</p>
                  <span className="text-12-semibold bg-primary-blue-50 text-primary-blue-300 rounded-full px-2 py-0.5">
                     {type.price}
                  </span>
               </button>
            ))}
         </div>
      </section>
   );
}
