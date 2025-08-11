import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";
import { Params } from "@/lib/types";

export async function getReceivedRequests(params: Params, targetLang?: string) {
   const searchParams = new URLSearchParams();
   Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
         searchParams.append(key, value.toString());
      }
   });

   await delay(1000);
   const res = await tokenFetch(
      `/requests?targetLang=${targetLang}&${searchParams.toString()}`,
      {
         method: "GET",
      },
   );

   return res;
}
