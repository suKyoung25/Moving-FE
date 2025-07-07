import React from "react";

const QuotaionInfo = () => {
  return (
    <article>
      <p className="text-16-semibold mb-6 lg:text-24-semibold lg:mb-10">
        견적 정보
      </p>
      <ul className="px-5 py-4 border border-line-100 rounded-2xl bg-bg-100 flex flex-col gap-2.5 text-14-regular lg:text-18-regular">
        <li className="flex items-center gap-10">
          <p className="w-16.5 text-gray-300 lg:w-22.5">견적 요청일</p>
          <p className="">24.08.26</p>
        </li>
        <li className="flex items-center gap-10">
          <p className="w-16.5  text-gray-300 lg:w-22.5">서비스</p>
          <p className="">사무실 이사</p>
        </li>
        <li className="flex items-center gap-10">
          <p className="w-16.5  text-gray-300 lg:w-22.5">이용일</p>
          <p className="">2024. 08. 26(월) 오전 10:00</p>
        </li>
        <li className="flex items-center gap-10">
          <p className="w-16.5  text-gray-300 lg:w-22.5">출발지</p>
          <p className="">서울시 어디구 여기구</p>
        </li>
        <li className="flex items-center gap-10">
          <p className="w-16.5  text-gray-300 lg:w-22.5">도착지</p>
          <p className="">서울시 어디구 여기구</p>
        </li>
      </ul>
    </article>
  );
};

export default QuotaionInfo;
