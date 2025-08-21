"use client";

import CommunityIndex from "@/components/domain/community/CommunityIndex";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { postCommunity } from "@/lib/api/community/requests/postCommunity";
import { updateCommunity } from "@/lib/api/community/requests/updateCommunity";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosArrowForward } from "react-icons/io";
import z from "zod";

const schema = z.object({
   title: z
      .string()
      .min(1, "제목을 입력해주세요.")
      .max(100, "제목은 100자 이하여야 합니다."),
   content: z
      .string()
      .min(1, "내용을 입력해주세요.")
      .max(2000, "내용은 2000자 이하여야 합니다."),
});

type FormData = z.infer<typeof schema>;

interface CommunityFormProps {
   mode: "create" | "edit";
   initialData?: {
      title: string;
      content: string;
   };
   communityId?: string;
}

export default function CommunityForm({
   mode,
   initialData,
   communityId,
}: CommunityFormProps) {
   const t = useTranslations("Community.createPost");
   const router = useRouter();
   const { user } = useAuth();
   const { showSuccess, showError } = useToast();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const isEditMode = mode === "edit";

   useEffect(() => {
      if (!user) {
         router.replace("/sign-in/client");
      }
   }, [user, router]);

   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
   } = useForm<FormData>({
      resolver: zodResolver(schema),
      mode: "onChange",
      defaultValues: {
         title: initialData?.title || "",
         content: initialData?.content || "",
      },
   });

   const onSubmit = async (data: FormData) => {
      if (!user) return;

      setIsSubmitting(true);

      try {
         if (isEditMode && communityId) {
            // 수정 모드
            await updateCommunity(communityId, data.title, data.content);
            showSuccess(t("successEditMessage"));
         } else {
            // 등록 모드
            await postCommunity(data.title, data.content);
            showSuccess(t("successMessage"));
         }

         router.push("/community");
      } catch (error) {
         console.error("게시글 처리 실패:", error);
         const errorMessage =
            error instanceof Error ? error.message : "처리에 실패했습니다.";
         showError(errorMessage);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="mb-4 flex items-start justify-between lg:mb-8">
            <CommunityIndex
               index={
                  isEditMode ? (
                     <div className="flex items-center gap-2">
                        <button
                           type="button"
                           onClick={() => router.back()}
                           className="hover:text-gray-500"
                        >
                           {t("communityDetail")}
                        </button>
                        <IoIosArrowForward />
                        {t("editPost")}
                     </div>
                  ) : (
                     t("title")
                  )
               }
            />
            <button
               type="submit"
               disabled={!isValid || isSubmitting}
               className={`text-16-semibold h-11 w-24 rounded-2xl text-white ${
                  isValid && !isSubmitting
                     ? "bg-primary-blue-300 hover:bg-primary-blue-200"
                     : "!cursor-not-allowed !bg-gray-300"
               }`}
            >
               {isEditMode ? t("editButton") : t("submitButton")}
            </button>
         </div>
         <div className="flex flex-col">
            <input
               {...register("title")}
               type="text"
               placeholder={
                  isEditMode ? "제목을 입력하세요" : t("titlePlaceholder")
               }
               className="border-b border-gray-100 py-5"
               aria-label={isEditMode ? "제목" : t("titleLabel")}
            />
            {errors.title && (
               <p className="text-14-semibold text-secondary-red-200">
                  *{errors.title.message}
               </p>
            )}

            <textarea
               {...register("content")}
               placeholder={
                  isEditMode ? "내용을 입력하세요" : t("contentPlaceholder")
               }
               className="h-90 resize-none py-5"
               aria-label={isEditMode ? "내용" : t("contentLabel")}
            />
            {errors.content && (
               <p className="text-14-semibold text-secondary-red-200">
                  *{errors.content.message}
               </p>
            )}
         </div>
      </form>
   );
}
