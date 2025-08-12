"use client";
import Image from "next/image";
import admin from "@/assets/images/admin.png";
import { IoIosSend } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function HomeTabPanel() {
   const router = useRouter();

   return (
      <div>
         <div className="flex gap-2">
            <Image
               src={admin}
               alt="관리자"
               width={36}
               height={36}
               priority
               className="h-9 w-9 rounded-lg"
            />
            <div>
               <h3 className="text-16-medium lg:text-18-medium">무빙 관리자</h3>
               <p className="text-14-regular lg:text-16-regular">
                  무빙을 사랑해주시는 모든 분들께 진심으로 감사드립니다. 오늘도
                  무빙과 함께 즐겁고 보람찬 하루 되시길 바랍니다.
               </p>
            </div>
         </div>
         <div className="mt-6 flex flex-col">
            <button
               onClick={() => router.push("/support")}
               className="bg-black-400 text-16-semibold hover:bg-black-500 flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-white transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
            >
               문의하기
               <IoIosSend className="size-5" />
            </button>
            <span className="text-12-regular mt-2 text-center text-gray-900 lg:mt-2.5">
               24시간 내 답변 받으실 수 있어요.
            </span>
         </div>
      </div>
   );
}
