"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SupportFormSchema, useSupportFormSchema } from "@/lib/schemas/index";

import SupportSubmitButton from "./SupportSubmitButton";
import SupportInput from "./SupportInput";
import { createSupport } from "@/lib/actions/support.action";
import ToastPopup from "@/components/common/ToastPopup";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function SupportForm() {
   const t = useTranslations("Support");
   const { supportFormSchema } = useSupportFormSchema();

   const methods = useForm<SupportFormSchema>({
      resolver: zodResolver(supportFormSchema),
      mode: "onChange",
   });

   const {
      handleSubmit,
      formState: { isValid, isSubmitting },
      reset,
   } = methods;

   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   const onSubmit = async (values: SupportFormSchema) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
         if (key === "file" && value instanceof FileList && value.length > 0) {
            formData.append("file", value[0]);
         } else if (typeof value === "string") {
            formData.append(key, value);
         }
      });

      const res = await createSupport(null, formData);

      setToast({
         id: Date.now(),
         text: res.message ?? t("defaultToastMessage"),
         success: res.success,
      });

      if (res.success) reset();
   };

   return (
      <FormProvider {...methods}>
         {toast && (
            <ToastPopup
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}

         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
               if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
                  e.preventDefault();
               }
            }}
            className="mt-4 flex w-full flex-col md:mt-6"
         >
            <div className="md:flex md:gap-10 lg:gap-20">
               <SupportInput name="name" label={t("nameLabel")} important />
               <SupportInput name="email" label={t("emailLabel")} important />
            </div>
            <div className="md:flex md:gap-10 lg:gap-20">
               <SupportInput name="title" label={t("titleLabel")} important />
               <SupportInput name="number" label={t("numberLabel")} />
            </div>
            <div>
               <SupportInput
                  name="content"
                  label={t("contentLabel")}
                  important
                  textarea
               />
               <SupportInput
                  name="file"
                  label={t("fileUploadLabel")}
                  fileupload
               />
            </div>
            <div
               className={`mt-4 flex justify-center transition-opacity duration-500 ease-in-out md:mt-6 ${
                  isValid ? "opacity-100" : "pointer-events-none opacity-0"
               }`}
            >
               <SupportSubmitButton isPending={isSubmitting} />
            </div>
         </form>
      </FormProvider>
   );
}
