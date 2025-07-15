"use client";

import { useState } from "react";
import QuotaionInfo from "../common/QuotaionInfo";
import Dropdown from "../common/Dropdown";
import ReceivedCard from "../common/ReceivedCard";

// 받았던 견적
export default function Received() {
  const [dropdownName, setDropdownName] = useState("전체");

  return (
    <div className="flex flex-col gap-2 md:gap-4 lg:gap-8">
      <section className="md:w-150 md:mx-auto md:px-8 md:py-4 md:border md:border-line-100 md:rounded-3xl md:shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.14),2px_2px_10px_0px_rgba(220,220,220,0.14)] lg:w-350 lg:px-10 lg:py-12">
        <QuotaionInfo />
        <article className="mt-8 lg:mt-10.5">
          <p className="text-16-semibold mb-6 lg:text-24-semibold lg:mb-10">
            견적서 목록
          </p>
          <Dropdown
            dropdownName={dropdownName}
            setDropdownName={setDropdownName}
          />
          <main className="mt-4 lg:mt-8 flex flex-col gap-6 md:gap-8 lg:gap-14">
            <ReceivedCard />
            <ReceivedCard />
          </main>
        </article>
      </section>
      <section className="md:w-150 md:mx-auto md:px-8 md:py-4 md:border md:border-line-100 md:rounded-3xl md:shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.14),2px_2px_10px_0px_rgba(220,220,220,0.14)] lg:w-350 lg:px-10 lg:py-12">
        <QuotaionInfo />
        <article className="mt-8 lg:mt-10.5">
          <p className="text-16-semibold mb-6 lg:text-24-semibold lg:mb-10">
            견적서 목록
          </p>
          <Dropdown
            dropdownName={dropdownName}
            setDropdownName={setDropdownName}
          />
          <main className="mt-4 lg:mt-8 flex flex-col gap-6 md:gap-8 lg:gap-14">
            <ReceivedCard />
            <ReceivedCard />
          </main>
        </article>
      </section>
    </div>
  );
}
