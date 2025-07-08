"use client";

import { searchAddressAction } from "@/lib/actions/request.action";
import { useState, useTransition } from "react";
import closeIcon from "@/assets/images/xIcon.svg";
import inputCloseIcon from "@/assets/images/xCircleIcon.svg";
import searchIcon from "@/assets/images/searchIcon.svg";
import Image from "next/image";

interface AddressResult {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
}

const addrBoxClass = "flex items-center gap-2 break-keep";
const addrTypeClass =
  "flex justify-center items-center w-11 h-6 lg:w-[54px] lg:h-7 px-1.5 py-0.5 bg-primary-blue-50 text-blue-500 text-xs lg:text-sm font-semibold rounded-3xl";
const addrClass = "max-lg:text-sm";

export default function AddressSearch({
  type,
  onSelect,
  onClose,
}: {
  type: string | null;
  onSelect: (addr: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value) return setResults([]);

    startTransition(async () => {
      const addresses = await searchAddressAction(value);
      console.log(addresses);
      setResults(addresses);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative w-[292px] h-[446px] lg:w-[608px] lg:h-[498px] bg-white rounded-3xl lg:rounded-4xl px-4 py-6 lg:px-6 lg:py-8 overflow-auto">
        <div className="flex justify-between items-center mb-[30px]">
          <h2 className="text-lg font-bold lg:text-2xl ">
            {type === "from"
              ? "출발지를 선택해주세요"
              : "도착지를 선택해주세요"}
          </h2>
          <button onClick={onClose}>
            <Image
              src={closeIcon}
              alt="모달 닫기"
              className="w-6 aspect-square lg:w-8"
            />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-2xl bg-bg-200"
            placeholder="텍스트를 입력해 주세요."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button
            className="absolute top-[14px] right-13"
            onClick={() => setQuery("")}
          >
            <Image src={inputCloseIcon} alt="입력창 초기화 아이콘" />
          </button>
          <button className="absolute top-[14px] right-4">
            <Image src={searchIcon} alt="검색 아이콘" />
          </button>
        </div>
        {results && results?.length > 0 && (
          <>
            {isPending && <p className="text-sm text-gray-400">검색 중...</p>}
            <ul className="space-y-3 mt-4">
              {results.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() =>
                    onSelect(item.roadAddress ?? item.jibunAddress)
                  }
                  className="flex flex-col gap-4 border p-4 rounded-xl shadow-[2px_2px_10px_0px_rgba(224,224,224,0.20) cursor-pointer border-line-100 hover:bg-primary-blue-50 hover:border-primary-blue-300"
                >
                  {/* 우편번호 */}
                  <p className="max-lg:text-sm font-semibold">
                    {item.zonecode}
                  </p>

                  {/* 도로명 주소 */}
                  <div className={addrBoxClass}>
                    <span className={addrTypeClass}>도로명</span>
                    <span className={addrClass}>{item.roadAddress}</span>
                  </div>

                  {/* 지번 주소 */}
                  <div className={addrBoxClass}>
                    <span className={addrTypeClass}>지번</span>
                    <span className={addrClass}>{item.jibunAddress}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
