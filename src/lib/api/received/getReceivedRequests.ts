// server-actions/getReceivedRequests.ts
"use server";
import { cookies } from "next/headers";

export async function getReceivedRequests(query: Record<string, string>) {
   const cookieStore = cookies();
   const accessToken = (await cookieStore).get("accessToken")?.value;

   if (!accessToken) throw new Error("Access token not found");

   const queryStr = new URLSearchParams(query).toString();

   const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/requests?${queryStr}`,
      {
         method: "GET",
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         cache: "no-store",
      },
   );

   if (!res.ok) throw new Error("받은 요청 목록을 불러오지 못했습니다.");
   return res.json();
}
