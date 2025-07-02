'use client'
import PaperPlane from "@/components/animations/PaperPlane";
import { useState } from "react";

export default function SupportSubmitButton() {

    const [isHover, setIsHover] = useState(false);

    return (
        <button
            type="submit"
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
                무빙에 문의하기
            </span>
            {isHover && (
                <span>
                    <PaperPlane active={isHover} />
                </span>
            )}
        </button>
    )
}