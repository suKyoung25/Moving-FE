"use client";

import { searchAddressAction } from "@/lib/actions/request.action";
import { startTransition, useState } from "react";
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
const tipExampleClass = "text-xs text-primary-blue-300 lg:text-sm";

// 주소 검색 모달
export default function AddressModal({
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

  // 사용자가 입력한 검색어로 카카오 주소 검색 API 호출
  const handleSearch = (value: string) => {
    setQuery(value);
    startTransition(async () => {
      const addresses = await searchAddressAction(value);
      setResults(addresses);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative w-[292px] h-[446px] lg:w-[608px] lg:h-[498px] bg-white rounded-3xl lg:rounded-4xl px-4 py-6 lg:px-6 lg:py-8 overflow-auto">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-4 lg:mb-6">
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

        {/* 검색 입력창 */}
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-2xl bg-bg-200"
            placeholder="텍스트를 입력해 주세요."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {/* TODO: 입력 초기화 오류 수정 */}
          <button
            className="absolute top-[14px] right-13 lg:top-2"
            onClick={() => setQuery("")}
          >
            <Image
              src={inputCloseIcon}
              alt="입력 초기화"
              className="w-6 aspect-square lg:w-9"
            />
          </button>
          <button className="absolute top-[14px] right-4">
            <Image src={searchIcon} alt="검색" />
          </button>
        </div>

        {/* 검색 결과 리스트로 반환 */}
        {results && results?.length > 0 ? (
          <>
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
        ) : (
          // 검색 예시
          <div className="p-4">
            <h2 className="text-lg font-semibold lg:text-xl lg:mb-2">tip</h2>
            <p className="flex flex-col gap-2 text-sm lg:text-base">
              <span className="text-gray-400 mb-2">
                아래와 같은 조합으로 검색을 하시면 더욱 정확한 결과가
                검색됩니다.
              </span>
              <span>도로명 + 건물번호 </span>
              <span className={tipExampleClass}>
                예) 판교역로 166, 제주 첨단로 242
              </span>
              <span>지역명(동/리) + 번지</span>
              <span className={tipExampleClass}>
                예) 백현동 532, 제주 영평동 2181
              </span>
              <span>지역명(동/리) + 건물명(아파트명)</span>
              <span className={tipExampleClass}>
                예) 분당 주공, 연수동 주공3차
              </span>
              <span> 사서함명 + 번호</span>
              <span className={tipExampleClass}>
                {" "}
                예) 분당우체국사서함 1~100
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
