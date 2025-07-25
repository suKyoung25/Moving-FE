import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";

export async function getSentEstimateDetail(id: string) {
   await delay(3000);
   try {
      const { data } = await tokenFetch(`/estimates/sented/${id}`, {
         method: "GET",
         cache: "no-store",
      });

      return data;
   } catch (error) {
      console.error("getSentEstimateDetail error:", error);
      return null;
   }
}
