'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from '@/assets/images/logo.svg'
import mobileLogo from '@/assets/images/logoMobile.svg'

export default function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`
                w-full fixed top-0 left-0 z-50
                transition-all duration-500 ease-in-out	
                ${isScrolled ? "bg-white" : "bg-none"}
            `}
        >
            <div
                className="
                    flex items-center justify-between
                    max-w-6xl mx-auto px-8 h-24 lg:px-0
                "
            >
                <Link href={"/"}>
                    <Image
                        src={mobileLogo}
                        alt="mobileLogo"
                        className="block md:!hidden w-7 h-8"
                    />
                    <Image
                        src={logo}
                        alt="logo"
                        className="!hidden md:!block w-[116px] h-11"
                    />
                </Link>
                <nav 
                    className={`
                        text-14-semibold md:text-18-bold flex items-center gap-3 md:gap-6 
                        ${isScrolled ? "text-black-400" : "text-white"}
                    `}
                >
                    <Link 
                        href={"/mover-search"} 
                        className={`
                            ${isScrolled ? "block" : "hidden"}
                            bg-primary-blue-300 text-white
                            py-2.5 px-4 rounded-full  text-14-semibold 
                            md:py-2 md:px-6 md:text-16-bold
                        `}
                    >서비스 둘러보기</Link>
                    <Link href={"/login"}>로그인</Link>
                    <Link href={"/signup"}>회원가입</Link>
                </nav>
            </div>
        </header>
    )
}