"use client";
import { useState } from "react";
import ReceivedRequestsList from "@/components/domain/received-requests/ReceivedRequestsList";
import PageTitle from "@/components/layout/PageTitle";
import KeywordSearchInput from "@/components/domain/received-requests/KeywordSearchInput";
import SortSelect from "@/components/domain/received-requests/SortSelect";
import Image from "next/image";
import filterActiveIcon from "@/assets/images/filterActiveIcon.svg";
import usePreventScroll from "@/lib/hooks/usePreventScroll";
import MoveTypeFilterSidebar from "@/components/domain/received-requests/MoveTypeFilterSidebar";
import { moveTypeOptions, sortOptions } from "@/constants";
import MoveTypeFilterModal from "@/components/domain/received-requests/MoveTypeFilterModal";

export default function ReceivedRequestsPage() {
   usePreventScroll(true);

   const [moveType, setMoveType] = useState<string[]>([
      "SMALL",
      "HOME",
      "OFFICE",
   ]);
   const [totalCount, setTotalCount] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
   const [isDesignated, setIsDesignated] = useState<boolean>(false);
   const [keyword, setKeyword] = useState<string>("");
   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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

   const isAllSelected = moveType.length === moveTypeOptions.length;

   const handleToggleAllMoveTypes = () => {
      if (isAllSelected) {
         setMoveType([]);
      } else {
         setMoveType(moveTypeOptions.map((opt) => opt.value));
      }
   };

   const handleToggleDesignated = () => {
      setIsDesignated((prev) => !prev);
   };

   return (
      <div>
         <div className="hidden lg:block">
            <PageTitle title="받은 요청" />
         </div>
         {/* 데스크탑 */}
         <div className="mt-6 hidden gap-20 lg:flex">
            <MoveTypeFilterSidebar
               moveType={moveType}
               onChangeMoveType={handleMoveTypeChange}
               onToggleAllMoveTypes={handleToggleAllMoveTypes}
               isAllSelected={isAllSelected}
               isDesignated={isDesignated}
               onToggleDesignated={handleToggleDesignated}
            />

            <div className="flex h-[calc(100vh-12.5rem)] w-full flex-col gap-6 overflow-hidden">
               <KeywordSearchInput value={keyword} onChange={setKeyword} />
               <div className="flex items-center justify-between">
                  <p className="lg:text-16-medium">
                     {isLoading
                        ? "요청 목록을 불러오는 중입니다..."
                        : `총 ${totalCount}건의 요청이 있습니다`}
                  </p>
                  <SortSelect
                     value={sort}
                     onChange={(v) =>
                        setSort(v as "moveDate-asc" | "moveDate-desc")
                     }
                     options={sortOptions}
                  />
               </div>
               <div className="scrollbar-hide flex-1 overflow-y-auto">
                  <ReceivedRequestsList
                     moveType={moveType}
                     isDesignated={isDesignated}
                     keyword={keyword}
                     sort={sort}
                     onTotalCountChange={setTotalCount}
                     onLoadingChange={setIsLoading}
                  />
               </div>
            </div>
         </div>

         {/* 테블릿 + 모바일 */}
         <div className="flex h-[calc(100vh-6.25rem)] flex-col gap-3 md:gap-4 lg:hidden">
            <div className="lg:hidden">
               <PageTitle title="받은 요청" />
            </div>
            <div className="sticky top-0 z-10 flex flex-col gap-3 bg-white pb-2 md:gap-4 lg:hidden">
               <KeywordSearchInput value={keyword} onChange={setKeyword} />
               <div className="flex items-center gap-3">
                  <p className="text-14-medium flex-1">
                     {isLoading
                        ? "요청 목록을 불러오는 중입니다..."
                        : `총 ${totalCount}건의 요청이 있습니다`}
                  </p>
                  <SortSelect
                     value={sort}
                     onChange={(v) =>
                        setSort(v as "moveDate-asc" | "moveDate-desc")
                     }
                     options={sortOptions}
                  />
                  <button onClick={() => setIsFilterModalOpen(true)}>
                     <Image
                        src={filterActiveIcon}
                        alt="filterActiveIcon"
                        width={32}
                        height={32}
                     />
                  </button>
               </div>
            </div>

            <section className="scrollbar-hide flex-1 overflow-y-auto lg:hidden">
               <ReceivedRequestsList
                  moveType={moveType}
                  isDesignated={isDesignated}
                  keyword={keyword}
                  sort={sort}
                  onTotalCountChange={setTotalCount}
                  onLoadingChange={setIsLoading}
               />
            </section>
         </div>

         <MoveTypeFilterModal
            moveType={moveType}
            isDesignated={isDesignated}
            isAllSelected={isAllSelected}
            onChangeMoveType={handleMoveTypeChange}
            onToggleAllMoveTypes={handleToggleAllMoveTypes}
            onToggleDesignated={handleToggleDesignated}
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
         />
      </div>
   );
}
