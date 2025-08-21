import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FaInstagram, FaFacebookF, FaYoutube, FaTwitter } from "react-icons/fa";
import { paperlogyExtraBold } from "@/app/fonts/fonts";
// fonts.ts에서 export 한 걸 불러옴

// components/MarketingSection5.tsx
export default function MarketingSection5() {
   const t = useTranslations("Landing");

   return (
      <section className="scroll-snap-start relative h-screen overflow-hidden">
         <div className="absolute inset-0 h-full w-full bg-white">
            <div className="mx-auto max-w-350">
               <div className="[&_*]:text-primary-blue-300 absolute top-1/2 z-10 flex w-full -translate-y-1/2 flex-col gap-7 px-5 md:gap-10 md:px-10 md:pt-0 lg:gap-14">
                  <div
                     className={`${paperlogyExtraBold.className} flex flex-col gap-6 md:gap-8`}
                  >
                     <h2 className="text-3xl whitespace-pre-line md:text-4xl lg:text-5xl lg:leading-14">
                        {t("yourLoad.title")}
                     </h2>
                     <nav className="flex flex-col gap-4 text-xl md:text-2xl lg:gap-6 lg:text-3xl [&_a]:hover:underline">
                        <Link href={"/mover-search"}>
                           {t("yourLoad.nav.browseServices")}
                        </Link>
                        <Link href={"/estimate-calculator"}>
                           {t("yourLoad.nav.estimateCalculator")}
                        </Link>
                        <Link href={"/support"}>
                           {t("yourLoad.nav.contactUs")}
                        </Link>
                     </nav>
                  </div>

                  {/* 소셜 아이콘 */}
                  <div className="flex items-center gap-4 lg:gap-6 [&_*]:size-7.5">
                     <Link
                        href={"#"}
                        aria-label={t("yourLoad.socialMedia.instagram")}
                        title={t("yourLoad.socialMedia.instagram")}
                     >
                        <FaInstagram />
                     </Link>
                     <Link
                        href={"#"}
                        aria-label={t("yourLoad.socialMedia.facebook")}
                        title={t("yourLoad.socialMedia.facebook")}
                     >
                        <FaFacebookF />
                     </Link>
                     <Link
                        href={"#"}
                        aria-label={t("yourLoad.socialMedia.youtube")}
                        title={t("yourLoad.socialMedia.youtube")}
                     >
                        <FaYoutube />
                     </Link>
                     <Link
                        href={"#"}
                        aria-label={t("yourLoad.socialMedia.twitter")}
                        title={t("yourLoad.socialMedia.twitter")}
                     >
                        <FaTwitter />
                     </Link>
                  </div>

                  {/* 푸터 */}
                  <footer className="text-14-medium lg:text-16-medium mt-4 flex flex-col">
                     <p className="text-16-semibold lg:text-18-semibold mb-2">
                        {t("yourLoad.footer.copyright")}
                     </p>
                     <p>{t("yourLoad.footer.teamName")}</p>
                     <p>{t("yourLoad.footer.organization")}</p>
                     <p>{t("yourLoad.footer.members")}</p>
                     <p>{t("yourLoad.footer.period")}</p>
                     <p>{t("yourLoad.footer.techStack")}</p>
                     <p>
                        {t("yourLoad.footer.contact")}&nbsp;
                        <a
                           href="mailto:codeit4movingteam@gmail.com"
                           className="underline"
                           aria-label={t("yourLoad.emailContact")}
                           title={t("yourLoad.emailContact")}
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
