'use client'
import PaperPlane from "@/components/animations/PaperPlane";
import { useState } from "react";

// 문의 전송 버튼 컴포넌트
export default function SupportSubmitButton({isPending} : {isPending : boolean}) {

    const [isHover, setIsHover] = useState(false);

    return (
        <button
            type="submit"
            disabled={isPending}
            
            className="
                flex items-center 
                px-10 py-3.5
                border-1 rounded-full
                hover:bg-black-400
                hover:border-0
                hover:[&>span]:text-primary-blue-300
                hover:[&>span:after]:w-0
                transition-all duration-1000 ease-in-out
            "
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <span
                className="
                    flex
                    relative
                    text-16-semibold
                    text-center
                    after:content-['']
                    after:absolute
                    after:-right-2
                    after:top-0
                    after:w-1
                    after:h-1
                    after:rounded-full
                    after:bg-primary-blue-300
                    transition-all duration-3000 ease-in-out
                "
            >
                 {/* 전송 중일 때 텍스트 변경 */}
                {
                    isPending ? "무빙에 문의하는 중" : "무빙에 문의하기"
                }
            </span>
            {isHover && (
                <span>
                    <PaperPlane active={isHover} />
                </span>
            )}
        </button>
    )
}