// lib/api/my-quotes/getSentEstimates.ts
import { cookies } from "next/headers";

export async function getSentEstimates() {
   try {
      const cookieStore = cookies();
      const accessToken = (await cookieStore).get("accessToken")?.value;

      if (!accessToken) throw new Error("Access token not found");

      console.log(process.env.NEXT_PUBLIC_API_URL);
      const res = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/estimates/sent`,
         {
            method: "GET",
            headers: {
               Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
         },
      );

      if (!res.ok) throw new Error("보낸 견적 목록을 불러오지 못했습니다.");

      return res.json();
   } catch (error) {
      console.error(error);
      return [];
   }
}
