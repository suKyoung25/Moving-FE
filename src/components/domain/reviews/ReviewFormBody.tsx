import React from "react";
import Image from "next/image";
import MoveChip from "@/components/common/MoveChip";
import profile from "@/assets/images/profileUploaderIcon.svg";
import yellowStar from "@/assets/images/starFilledIcon.svg";
import grayStar from "@/assets/images/starOutlineIcon.svg";
import { WritableReview } from "@/lib/types";
import { formatIsoToYMD } from "@/lib/utils";
import { isChipType } from "@/lib/utils/moveChip.util";
import { useTranslations } from "next-intl";
import ReviewImageUpload from "./ReviewImageUpload";
import { Control, FieldValues, Path } from "react-hook-form";

type ReviewFormBodyProps<T extends FieldValues = FieldValues> = {
   estimate: WritableReview;
   rating: number;
   setRating: (n: number) => void;
   hovered: number | null;
   setHovered: (n: number | null) => void;
   content: string;
   setContent: (v: string) => void;
   errorRating: string | undefined;
   errorContent: string | undefined;
   control?: Control<T>;
};

export function ReviewFormBody<T extends FieldValues = FieldValues>({
   estimate,
   rating,
   setRating,
   hovered,
   setHovered,
   content,
   setContent,
   errorRating,
   errorContent,
   control,
}: ReviewFormBodyProps<T>) {
   const t = useTranslations("Reviews");

   const ratingErrorId = errorRating ? "rating-error" : undefined; //  에러 메시지와 연결할 id
   const contentErrorId = errorContent ? "content-error" : undefined;

   return (
      <>
         {/* 카드 정보 */}
         <div className="mb-3.5 flex gap-2 lg:gap-3">
            {isChipType(estimate.moveType) && (
               <MoveChip type={estimate.moveType} />
            )}
            {estimate.isDesignatedEstimate && <MoveChip type="DESIGNATED" />}
         </div>
         <div className="border-line-100 mb-3.5 flex w-full items-center rounded-md bg-white shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)] md:px-2 lg:mb-6 lg:border lg:px-4.5 lg:py-6">
            {/* 프로필 이미지 */}
            <div className="border-primary-blue-400 relative mr-3 h-11.5 w-11.5 overflow-hidden rounded-full border-2 lg:mr-6 lg:h-24 lg:w-24">
               <Image
                  src={estimate.moverProfileImage || profile}
                  alt={
                     estimate.moverProfileImage
                        ? t("profileAlt", { name: estimate.moverNickName })
                        : t("defaultProfileAlt")
                  }
                  fill
                  className="object-cover"
               />
            </div>
            {/* 견적 상세 정보 */}
            <div className="flex-1">
               <div className="flex items-center justify-between">
                  <span className="text-14-semibold lg:text-18-semibold text-black-300">
                     {estimate.moverNickName} {t("mover")}
                  </span>
               </div>
               <div className="text-13-medium lg:text-16-medium mt-3 flex items-center text-gray-300 lg:mt-4">
                  <span className="flex items-center gap-1.5 lg:gap-3">
                     <span className="bg-bg-400 rounded-sm px-1 py-0.5 lg:px-1.5 lg:py-1">
                        {t("moveDate")}
                     </span>
                     <time
                        className="text-black-300"
                        dateTime={estimate.moveDate}
                     >
                        {formatIsoToYMD(estimate.moveDate)}
                     </time>
                  </span>
                  <span
                     className="bg-line-200 mx-2.5 h-3 w-px lg:mx-4"
                     aria-hidden="true"
                  ></span>
                  <span className="flex items-center gap-1.5 lg:gap-3">
                     <span className="bg-bg-400 rounded-sm px-1 py-0.5 lg:px-1.5 lg:py-1">
                        {t("price")}
                     </span>
                     <span
                        className="text-black-300"
                        aria-label={`${estimate.price.toLocaleString()} ${t("money")}`} // ✅ 접근성 개선: 가격과 통화를 함께 읽음
                     >
                        {estimate.price.toLocaleString()}
                        {t("money")}
                     </span>
                  </span>
               </div>
            </div>
         </div>
         <hr className="bg-line-100 my-5 h-px w-full border-0 lg:hidden" />
         {/* 별점 */}
         <div>
            <span
               className="text-16-semibold lg:text-20-semibold"
               id="rating-label"
            >
               {t("selectRating")}
            </span>
            <div
               className="my-3 flex gap-1"
               role="radiogroup"
               aria-labelledby="rating-label"
               aria-describedby={ratingErrorId}
            >
               {[1, 2, 3, 4, 5].map((star) => {
                  const checked = star === rating;
                  return (
                     <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(null)}
                        className="focus:ring-0 focus:outline-none"
                        aria-label={t("starAria", { point: star })}
                     >
                        <Image
                           src={
                              star <= (hovered ?? rating)
                                 ? yellowStar
                                 : grayStar
                           }
                           alt=""
                           aria-hidden="true"
                           width={48}
                           height={48}
                           className="h-6 w-6 lg:h-12 lg:w-12"
                        />
                     </button>
                  );
               })}
               {errorRating && (
                  <p
                     id={ratingErrorId}
                     role="alert"
                     aria-live="assertive"
                     className="mt-2 text-sm text-red-500"
                  >
                     {errorRating}
                  </p>
               )}
            </div>
            <hr className="bg-line-100 my-3 h-px w-full border-0" />
         </div>
         {/* 후기 입력 */}
         <div>
            <label
               htmlFor="review-content"
               className="text-16-semibold lg:text-20-semibold mb-4 block"
            >
               {t("detailReview")}
            </label>
            <textarea
               className="bg-bg-200 h-20 w-full resize-none rounded-2xl px-4 py-3.5 lg:h-30"
               placeholder={t("placeholder")}
               value={content}
               onChange={(e) => setContent(e.target.value)}
               aria-required="true"
               aria-invalid={!!errorContent}
               aria-describedby={contentErrorId}
            />
            {errorContent && (
               <p
                  id={contentErrorId}
                  role="alert"
                  aria-live="assertive"
                  className="mt-2 text-sm text-red-500"
               >
                  {errorContent}
               </p>
            )}
         </div>

         {/* 이미지 업로드 */}
         {control && (
            <div className="mt-3">
               <ReviewImageUpload
                  name={"images" as Path<T>}
                  control={control}
                  labelId="review-images"
                  text={t("uploadImages")}
                  maxImages={3}
               />
            </div>
         )}
      </>
   );
}
