import Image from "next/image";
import Search from "@/assets/images/searchIcon.svg";

export default function SearchBox() {
   return (
      <div className="relative mt-7.5">
         <Image
            src={Search}
            alt="검색아이콘"
            width={24}
            height={24}
            className="absolute top-1/2 left-4 -translate-y-1/2"
         />
         <input
            type="search"
            placeholder="텍스트를 입력해 주세요"
            className="bg-bg-200 h-14 w-full rounded-2xl pr-4 pl-11.5"
         />
      </div>
   );
}
