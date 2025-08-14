import { defaultFetch } from "@/lib/utils";

export default async function getCommunity(id: string, locale?: string) {
   try {
      return await defaultFetch(`/community/${id}?targetLang=${locale}`, {
         method: "GET",
      });
   } catch (e) {
      throw e;
   }
}
