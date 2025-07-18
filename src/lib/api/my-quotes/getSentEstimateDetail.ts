import { cookies } from "next/headers";

export async function getSentEstimateDetail(id: string) {
   try {
      const cookieStore = cookies();
      const accessToken = (await cookieStore).get("accessToken")?.value;

      if (!accessToken) throw new Error("Access token not found");

      const res = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/estimates/sented/${id}`,
         {
            method: "GET",
            headers: {
               Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
         },
      );

      if (!res.ok)
         throw new Error("보낸 견적 요청 상세 정보를 불러오지 못했습니다.");

      const { data } = await res.json();
      return data;
   } catch (error) {
      console.error("getSentEstimateDetail error:", error);
      return null;
   }
}
