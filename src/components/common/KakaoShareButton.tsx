"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import shareKakaoIcon from "@/assets/images/shareKakaoIcon.svg";
import { useTranslations } from "next-intl";

export default function KakaoShareButton() {
   const t = useTranslations("ShareButton");

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
   }, [appKey]);

   const handleClick = () => {
      if (!window.Kakao || !kakaoUrl) return;

      window.Kakao.Link.sendDefault({
         objectType: "feed",
         content: {
            title: t("kakao.title"),
            description: t("kakao.description"),
            imageUrl,
            link: {
               mobileWebUrl: kakaoUrl,
               webUrl: kakaoUrl,
            },
         },
         buttons: [
            {
               title: t("kakao.buttonText"),
               link: {
                  mobileWebUrl: kakaoUrl,
                  webUrl: kakaoUrl,
               },
            },
         ],
      });
   };

   return (
      <button onClick={handleClick} aria-label={t("kakao.ariaLabel")}>
         <Image
            src={shareKakaoIcon}
            width={40}
            height={40}
            alt={t("kakao.altText")}
            className="lg:h-16 lg:w-16"
         />
      </button>
   );
}
