import SupportForm from "@/components/domain/support/SupportForm";
import { getTranslations } from "next-intl/server";

export default async function SupportPage() {
   const t = await getTranslations("Support");

   return (
      <div className="h-full w-full">
         <p className="text-16-medium md:text-28-medium">
            {t("supportMessage")}
         </p>
         {/* 추후 Let's Work Together 이미지 처리 */}
         <h2 className="font-paperlogy mt-2.5 text-5xl leading-14 font-bold md:mt-5 md:text-7xl md:leading-20">
            Let’s Work Together
         </h2>
         <SupportForm />
      </div>
   );
}
