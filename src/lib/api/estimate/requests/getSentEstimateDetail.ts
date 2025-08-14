import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";

export async function getSentEstimateDetail(id: string, targetLang?: string) {
   await delay(500);
   try {
      const { data } = await tokenFetch(
         `/estimates/sented/${id}?targetLang=${targetLang}`,
         {
            method: "GET",
            cache: "force-cache",
         },
      );

      return data;
   } catch (error) {
      console.error("getSentEstimateDetail error:", error);
      return null;
   }
}
