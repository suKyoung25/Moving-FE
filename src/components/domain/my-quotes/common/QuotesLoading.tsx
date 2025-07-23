import Image from "next/image";
import emptyQuotes from "@/assets/images/emptyBlueFolderIcon.svg";

export default function QuotesLoading() {
   return (
      <div className="mt-32 flex flex-col items-center justify-center gap-8">
         <Image src={emptyQuotes} alt="대기중인 견적 없음" />
         <p className="text-16-regular md:text-24-regular text-center text-gray-400">
            기사님들이 열심히 확인 중이에요!
            <br />곧 견적이 도착할 거에요!
         </p>
      </div>
   );
}
