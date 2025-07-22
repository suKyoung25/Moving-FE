"use server";
import { cookies } from "next/headers";
import { BASE_URL } from "../utils/fetch-client";
import {
   getCreateReviewPayloadFromForm,
   validateCreateReview,
} from "../schemas/reviews.schema";

export async function createReviewAction(
   prevState: { success: boolean; message: string },
   formData: FormData,
): Promise<{ success: boolean; message: string }> {
   const payload = getCreateReviewPayloadFromForm(formData);
   const { valid, message } = validateCreateReview(payload);
   if (!valid)
      return { success: false, message: message ?? "유효성 검사 실패" };

   const accessToken = (await cookies()).get("accessToken")?.value;
   if (!accessToken) {
      return {
         success: false,
         message: "쿠키로그인 정보가 없습니다. 다시 로그인해 주세요.",
      };
   }

   try {
      const response = await fetch(`${BASE_URL}/reviews`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
         },
         body: JSON.stringify(payload),
      });

      // 에러 메시지
      if (!response.ok) {
         let msg = "리뷰 등록 중 오류가 발생했습니다.";
         try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
               const error = await response.json();
               msg = error?.message || msg;
            } else {
               const text = await response.text();
               if (text) msg = text;
            }
         } catch {}
         return { success: false, message: msg };
      }
      return { success: true, message: "리뷰가 등록되었습니다." };
   } catch (error) {
      console.error(error);
      return {
         success: false,
         message: "리뷰 등록 중 오류가 발생했습니다",
      };
   }
}
