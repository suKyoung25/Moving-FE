"use server";

import { cookies } from "next/headers";

interface CreateRequestDto {
   moveType: "SMALL" | "HOME" | "OFFICE";
   moveDate: Date;
   fromAddress: string;
   toAddress: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function createRequestAction(requestData: CreateRequestDto) {
   try {
      const accessToken = (await cookies()).get("accessToken")?.value;

      const res = await fetch(`${BASE_URL}/requests`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
         },
         body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.message || "서버 오류가 발생했습니다.");
      }

      return data;
   } catch (err) {
      console.error("견적 요청 실패:", err);
      throw err;
   }
}
