import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";

export async function getSentEstimates() {
   await delay(3000);
   try {
      const data = await tokenFetch("/estimates/sent", {
         method: "GET",
         cache: "no-store",
      });

      return data;
   } catch (error) {
      console.error("보낸 견적 목록을 불러오지 못했습니다.", error);
      return [];
   }
}
