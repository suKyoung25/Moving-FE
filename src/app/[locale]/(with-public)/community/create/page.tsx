"use client";

import ToastPopup from "@/components/common/ToastPopup";
import PageTitle from "@/components/layout/PageTitle";
import { useAuth } from "@/context/AuthContext";
import { postCommunity } from "@/lib/api/community/requests/postCommunity";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
   title: z.string().min(1, "titleRequired"),
   content: z.string().min(1, "contentRequired"),
});

type FormData = z.infer<typeof schema>;

export default function CreateCommunityPage() {
   const t = useTranslations("Community.createPost");
   const router = useRouter();
   const { user } = useAuth();
   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   useEffect(() => {
      if (!user) {
         router.replace("/sign-in/client");
      }
   }, [user, router]);

   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isSubmitting },
   } = useForm<FormData>({
      resolver: zodResolver(schema),
      mode: "onChange",
   });

   const onSubmit = async (data: FormData) => {
      try {
         await postCommunity(data.title, data.content);

         setToast({
            id: Date.now(),
            text: t("successMessage"),
            success: true,
         });

         setTimeout(() => {
            router.push("/community");
         }, 3000);
      } catch (e) {
         console.error(e);
      }
   };

   return (
      <div>
         <PageTitle title={t("title")} />
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-end">
               <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`text-18-semibold h-11 w-29 rounded-2xl text-white ${
                     isValid && !isSubmitting
                        ? "bg-primary-blue-300 hover:bg-primary-blue-400"
                        : "cursor-not-allowed bg-gray-300"
                  }`}
               >
                  {t("submitButton")}
               </button>
            </div>
            <div className="flex flex-col">
               <input
                  {...register("title")}
                  type="text"
                  placeholder={t("titlePlaceholder")}
                  className="border-b border-gray-100 py-5"
                  aria-label={t("titleLabel")}
               />
               {errors.title && (
                  <p className="text-14-semibold text-secondary-red-200">
                     *{t("titleRequired")}
                  </p>
               )}

               <textarea
                  {...register("content")}
                  placeholder={t("contentPlaceholder")}
                  className="h-90 resize-none py-5"
                  aria-label={t("contentLabel")}
               />
               {errors.content && (
                  <p className="text-14-semibold text-secondary-red-200">
                     *{t("contentRequired")}
                  </p>
               )}
            </div>
         </form>
         {toast && (
            <ToastPopup
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}
      </div>
   );
}
