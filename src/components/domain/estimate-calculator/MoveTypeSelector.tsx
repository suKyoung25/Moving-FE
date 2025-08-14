import React from "react";
import { MoveTypeOption } from "@/lib/types";
import { FaTruck } from "react-icons/fa6";
import { useTranslations } from "next-intl";

interface MoveTypeSelectorProps {
   selected: string;
   onTypeSelect: (type: "SMALL" | "HOME" | "OFFICE") => void;
}

export default function MoveTypeSelector({
   selected,
   onTypeSelect,
}: MoveTypeSelectorProps) {
   const t = useTranslations("Calculator.moveType");

   const moveTypes: MoveTypeOption[] = [
      {
         moveType: "SMALL",
         label: t("SMALL"),
         desc: t("SMALL_DESC"),
         price: `4${t("tenThousandUnit")}${t("currency")}~`,
      },
      {
         moveType: "HOME",
         label: t("HOME"),
         desc: t("HOME_DESC"),
         price: `8${t("tenThousandUnit")}${t("currency")}~`,
      },
      {
         moveType: "OFFICE",
         label: t("OFFICE"),
         desc: t("OFFICE_DESC"),
         price: `10${t("tenThousandUnit")}${t("currency")}~`,
      },
   ];

   return (
      <section aria-labelledby="move-type-title">
         <div className="mb-4 flex items-center gap-2">
            <FaTruck className="h-5 w-5" aria-hidden="true" />
            <h2 id="move-type-title" className="text-18-semibold">
               {t("title")}
            </h2>
         </div>

         <div className="grid grid-cols-3 gap-3" role="radiogroup">
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
                  role="radio"
                  aria-checked={selected === type.moveType}
                  aria-describedby={`${type.moveType}-desc`}
               >
                  <h3 className="text-14-semibold">{type.label}</h3>
                  <p
                     id={`${type.moveType}-desc`}
                     className="text-black-400 text-12-regular"
                  >
                     {type.desc}
                  </p>
                  <span className="text-12-semibold bg-primary-blue-50 text-primary-blue-300 rounded-full px-2 py-0.5">
                     {type.price}
                  </span>
               </button>
            ))}
         </div>
      </section>
   );
}
