import { tokenFetch } from "@/lib/utils";

export async function fetchClientReceivedQuotes(
   category: string,
   page: number,
) {
   try {
      return await tokenFetch(
         `/estimates/received?category=${category}&page=${page}&limit=6`,
         {
            method: "GET",
         },
      );
   } catch (e) {
      throw e;
   }
}
