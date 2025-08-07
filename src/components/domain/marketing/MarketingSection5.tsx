import Link from "next/link";
import { FaInstagram, FaFacebookF, FaYoutube, FaTwitter } from "react-icons/fa";

// components/MarketingSection4.tsx
export default function MarketingSection5() {
   return (
      <section className="scroll-snap-start relative h-screen overflow-hidden">
         <div className="absolute inset-0 h-full w-full bg-white">
            <div className="mx-auto max-w-350">
               <div className="[&_*]:text-primary-blue-300 absolute top-1/2 z-10 flex w-full -translate-y-1/2 flex-col gap-7 px-5 md:gap-10 md:px-10 md:pt-0 lg:gap-14">
                  <div className="font-paperlogy flex flex-col gap-6 md:gap-8">
                     <h2 className="text-3xl md:text-4xl lg:text-5xl lg:leading-14">
                        당신의 짐보다,
                        <br />
                        당신의 마음을 옮깁니다.
                     </h2>
                     <nav className="flex flex-col gap-4 text-xl md:text-2xl lg:gap-6 lg:text-3xl [&_a]:hover:underline">
                        <Link href={"/mover-search"}>서비스 둘러보기</Link>
                        <Link href={"/support"}>견적계산기</Link>
                        <Link href={"/support"}>문의하기</Link>
                     </nav>
                  </div>
                  <div className="flex items-center gap-4 lg:gap-6 [&_*]:size-7.5">
                     <Link href={"#"}>
                        <FaInstagram />
                     </Link>
                     <Link href={"#"}>
                        <FaFacebookF />
                     </Link>
                     <Link href={"#"}>
                        <FaYoutube />
                     </Link>
                     <Link href={"#"}>
                        <FaTwitter />
                     </Link>
                  </div>
                  <footer className="text-14-medium lg:text-16-medium mt-4 flex flex-col">
                     <p className="text-16-semibold lg:text-18-semibold mb-2">
                        ©CODEIT FULLSTACK TEAM 4
                     </p>
                     <p>팀명: 무빙(Moving) / 풀스택 고급 프로젝트</p>
                     <p>소속: 코드잇 풀스택 과정 6기</p>
                     <p>참여 인원: 7명 (풀스택 개발자)</p>
                     <p>개발 기간: 2025.07.01 ~ 2025.08.13</p>
                     <p>기술 스택: Next.js, Tailwind, express, Prisma 외</p>
                     <p>
                        문의:{" "}
                        <a
                           href="mailto:codeit4movingteam@gmail.com"
                           className="underline"
                        >
                           codeit4movingteam@gmail.com
                        </a>
                     </p>
                  </footer>
               </div>
            </div>
         </div>
      </section>
   );
}
