import Image from "next/image";
import Link from "next/link";
import earth from "@/assets/images/earthIcon.png";
import oopsMover from "@/assets/images/oopsMover.png";
import oopsTruchMover from "@/assets/images/oopsTruchMoverIcon.png";
import star from "@/assets/images/starIcon.png";
import otherLogo from "@/assets/images/otherLogo.png";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
   const t = await getTranslations("NotFound");

   return (
      <div className="bg-primary-blue-600 fixed h-full min-h-screen w-full overflow-hidden">
         <div className="absolute top-4 left-3 md:top-10 md:left-10">
            <Image
               src={otherLogo}
               alt={t("logoAlt")}
               width={80}
               className="md:w-28"
            />
         </div>
         <div className="absolute top-36 -right-8 md:right-1/12 lg:right-45">
            <Image
               src={earth}
               alt={t("earthAlt")}
               width={150}
               height={150}
               className="md:h-48 md:w-48 lg:h-60 lg:w-60"
            />
         </div>
         <div className="absolute -bottom-4 -left-4 md:hidden">
            <Image src={oopsMover} alt={t("moverAlt")} width={180} />
         </div>
         <div className="absolute bottom-0 -left-28 hidden md:block">
            <Image
               src={oopsTruchMover}
               alt={t("truckMoverAlt")}
               width={600}
               className="lg:w-[750px]"
            />
         </div>
         <div>
            <Image
               src={star}
               alt={t("starAlt")}
               width={40}
               className="absolute top-1/4 left-1/6 md:top-1/6 md:left-1/5 md:w-13 lg:left-1/3 lg:w-14"
            />
            <Image
               src={star}
               alt={t("starAlt")}
               width={25}
               className="absolute top-1/3 left-3 md:left-25 md:w-8 lg:top-2/6 lg:left-1/4 lg:w-10"
            />
            <Image
               src={star}
               alt={t("starAlt")}
               width={30}
               className="absolute right-4 bottom-1/3 md:right-45 md:bottom-1/4 md:w-10 lg:right-1/4 lg:bottom-1/5 lg:w-11"
            />
         </div>
         <div className="absolute top-1/2 left-1/2 z-30 flex -translate-1/2 flex-col gap-3 text-center text-nowrap text-white md:gap-4">
            <h2 className="text-20-semibold md:text-32-semibold whitespace-pre-line lg:text-4xl lg:leading-12">
               {t("pageNotFoundTitle")}
            </h2>
            <p className="text-13-medium md:text-16-medium">
               {t("pageNotFoundMessageLine1")}
               <br />
               {t("pageNotFoundMessageLine2")}
               <br />
               {t("pageNotFoundMessageLine3")}
            </p>
            <Link
               href={"/mover-search"}
               className="bg-primary-blue-300 text-14-semibold md:text-16-semibold mx-auto mt-3 w-fit rounded-sm px-4 py-2 md:mt-4 md:px-5 md:py-2.5"
            >
               {t("goToMain")}
            </Link>
         </div>
         <div className="text-13-medium md:text-14-medium absolute bottom-[3%] left-1/2 -translate-x-1/2 text-center text-nowrap text-gray-200 md:bottom-[4%]">
            Copyright Ⓒ MOVING Inc.
            <br className="md:hidden" /> All Rights Reserved.
         </div>
      </div>
   );
}
