"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import shareKakaoIcon from "@/assets/images/shareKakaoIcon.svg";

export default function KakaoShareButton() {
   const [kakaoUrl, setKakaoUrl] = useState("");
   const imageUrl =
      "https://nowonbomcenter.org/wp-content/uploads/2022/01/talk_sangdam_bom-750x375.png";
   const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

   useEffect(() => {
      setKakaoUrl(window.location.href);

      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.js";
      script.async = true;
      script.onload = () => {
         if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(appKey!);
         }
      };
      document.head.appendChild(script);
   }, []);

   const handleClick = () => {
      if (!window.Kakao || !kakaoUrl) return;

      window.Kakao.Link.sendDefault({
         objectType: "feed",
         content: {
            title: "믿을 수 있는 이사, 무빙에서 시작하세요.",
            description:
               "견적부터 기사님 선택까지, 이사 준비를 쉽고 빠르게! 지금 무빙에서 확인해보세요.",
            imageUrl,
            link: {
               mobileWebUrl: kakaoUrl,
               webUrl: kakaoUrl,
            },
         },
         buttons: [
            {
               title: "무빙에서 확인하기",
               link: {
                  mobileWebUrl: kakaoUrl,
                  webUrl: kakaoUrl,
               },
            },
         ],
      });
   };

   return (
      <button onClick={handleClick}>
         <Image
            src={shareKakaoIcon}
            width={40}
            height={40}
            alt="카카오톡 공유 버튼"
            className="lg:h-16 lg:w-16"
         />
      </button>
   );
}
