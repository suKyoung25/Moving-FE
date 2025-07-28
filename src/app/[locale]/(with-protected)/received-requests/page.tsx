"use client";
import { useState } from "react";
import ReceivedRequestsList from "@/components/domain/received-requests/ReceivedRequestsList";

const moveTypeOptions = [
   { label: "소형이사", value: "SMALL" },
   { label: "가정이사", value: "HOME" },
   { label: "사무실이사", value: "OFFICE" },
];

const sortOptions = [
   { label: "이사일 빠른순", value: "moveDate-asc" },
   { label: "이사일 느린순", value: "moveDate-desc" },
];

export default function ReceivedRequestsPage() {
   const [moveType, setMoveType] = useState<string[]>([
      "SMALL",
      "HOME",
      "OFFICE",
   ]);
   const [isDesignated, setIsDesignated] = useState<boolean>(false);
   const [keyword, setKeyword] = useState<string>("");
   const [sort, setSort] = useState<"moveDate-asc" | "moveDate-desc">(
      "moveDate-asc",
   );

   const handleMoveTypeChange = (value: string) => {
      setMoveType((prev) =>
         prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value],
      );
   };

   return (
      <div className="flex">
         <aside className="w-1/4 px-4">
            <h2 className="text-lg font-bold">이사 유형</h2>
            <label className="block font-medium">
               <input
                  type="checkbox"
                  checked={moveType.length === moveTypeOptions.length}
                  onChange={() => {
                     if (moveType.length === moveTypeOptions.length) {
                        setMoveType([]); // 전체 해제
                     } else {
                        setMoveType(moveTypeOptions.map((opt) => opt.value)); // 전체 선택
                     }
                  }}
                  className="mr-2"
               />
               전체 선택
            </label>
            {moveTypeOptions.map((option) => (
               <label key={option.value} className="block">
                  <input
                     type="checkbox"
                     checked={moveType.includes(option.value)}
                     onChange={() => handleMoveTypeChange(option.value)}
                  />
                  {option.label}
               </label>
            ))}

            <label className="mt-4 block">
               <input
                  type="checkbox"
                  checked={isDesignated}
                  onChange={() => setIsDesignated((prev) => !prev)}
               />
               지정 견적 요청만 보기
            </label>

            <div className="mt-4">
               <label className="block">고객명 검색</label>
               <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full border px-2 py-1"
                  placeholder="이름을 입력하세요"
               />
            </div>

            <div className="mt-4">
               <label>정렬</label>
               <select
                  value={sort}
                  onChange={(e) =>
                     setSort(e.target.value as "moveDate-asc" | "moveDate-desc")
                  }
                  className="w-full border px-2 py-1"
               >
                  {sortOptions.map((s) => (
                     <option key={s.value} value={s.value}>
                        {s.label}
                     </option>
                  ))}
               </select>
            </div>
         </aside>

         <section className="w-3/4 px-4">
            <ReceivedRequestsList
               moveType={moveType}
               isDesignated={isDesignated}
               keyword={keyword}
               sort={sort}
            />
         </section>
      </div>
   );
}
