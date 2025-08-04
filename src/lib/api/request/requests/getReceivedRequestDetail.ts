import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";

export async function getReceivedRequestDetail(id: string) {
   await delay(2000);
   try {
      const data = await tokenFetch(`/requests/detail/${id}`, {
         method: "GET",
         cache: "force-cache",
      });

      return data;
   } catch (error) {
      console.error("getReceivedRequestDetail error:", error);
      return null;
   }
}
