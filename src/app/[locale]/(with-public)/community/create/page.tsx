"use client";

import ToastPopup from "@/components/common/ToastPopup";
import PageTitle from "@/components/layout/PageTitle";
import { useAuth } from "@/context/AuthContext";
import { postCommunity } from "@/lib/api/community/postCommunity";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const placeholderText = `내용을 입력해 주세요.

이사하면서 궁금했던 모든 것을 물어보세요.

* 주제에 맞지 않는 글이나 커뮤니티 이용정책에 위배되는 글은 신고의 대상이 됩니다.
* 일정 수 이상의 신고를 받으면 작성한 글이 숨김 및 삭제될 수 있습니다.`;

const schema = z.object({
   title: z.string().min(1, "제목은 필수입니다."),
   content: z.string().min(1, "내용은 필수입니다."),
});

type FormData = z.infer<typeof schema>;

export default function page() {
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
            text: "글이 성공적으로 작성되었습니다!",
            success: true,
         });

         setTimeout(() => {
            router.push("/community");
         }, 3000);
      } catch (e) {
         console.log(e);
      }
   };

   return (
      <div>
         <PageTitle title="커뮤니티" />
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
                  등록
               </button>
            </div>
            <div className="flex flex-col">
               <input
                  {...register("title")}
                  type="text"
                  placeholder="제목을 입력해주세요."
                  className="border-b border-gray-100 py-5"
               />
               {errors.title && (
                  <p className="text-14-semibold text-secondary-red-200">
                     *{errors.title.message}
                  </p>
               )}
               <textarea
                  {...register("content")}
                  placeholder={placeholderText}
                  className="h-90 resize-none py-5"
               />
               {errors.content && (
                  <p className="text-14-semibold text-secondary-red-200">
                     *{errors.content.message}
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
