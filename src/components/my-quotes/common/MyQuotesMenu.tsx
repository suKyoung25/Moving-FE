"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MyQuotesMenu = () => {
  const currentPath = usePathname();

  const isPending =
    currentPath === "/my-quotes" || /^\/my-quotes\/\d+/.test(currentPath);

  const isReceived = /^\/my-quotes\/received(\/.*)?$/.test(currentPath);

  return (
    <div className=" mx-auto px-[24px] md:px-[72px] lg:px-0 border-b border-line-100 bg-white">
      <ul className="flex items-center gap-[24px] text-14-semibold lg:text-20-semibold text-gray-400">
        <li
          className={`h-[54px] lg:h-[80px] flex items-center ${isPending && "border-b-[2px] border-primary-blue-400 text-14-bold lg:text-20-bold text-black-400"} `}
        >
          <Link href="/my-quotes">대기 중인 견적</Link>
        </li>
        <li
          className={`h-[54px] lg:h-[80px] flex items-center ${isReceived && "border-b-[2px] border-primary-blue-400 text-14-bold lg:text-20-bold text-black-400"} `}
        >
          <Link href="/my-quotes/received">받았던 견적</Link>
        </li>
      </ul>
    </div>
  );
};

export default MyQuotesMenu;
