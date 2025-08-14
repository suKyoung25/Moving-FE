import BasicInfoForms from "@/components/domain/dashboard/BasicInfoForms";
import { getTranslations } from "next-intl/server";

export default async function MoverBasicInfoEditPage() {
   const t = await getTranslations("Dashboard");

   return (
      <>
         <div className="mb-6 flex flex-col gap-4 lg:mb-12 lg:gap-8">
            <div className="text-18-semibold lg:text-32-semibold leading-8">
               {t("basicInfoEditTitle")}
            </div>
         </div>

         <hr className="border-line-100 m-0 border-t p-0" />

         <div className="mt-10">
            <BasicInfoForms />
         </div>
      </>
   );
}
