import { cookies } from "next/headers";

export async function getRejectedEstimates() {
   try {
      const cookieStore = cookies();
      const accessToken = (await cookieStore).get("accessToken")?.value;

      if (!accessToken) throw new Error("Access token not found");

      const res = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/estimates/rejected`,
         {
            method: "GET",
            headers: {
               Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
         },
      );

      if (!res.ok) throw new Error("반려된 견적 목록을 불러오지 못했습니다.");

      return res.json();
   } catch (error) {
      console.error(error);
      return [];
   }
}
