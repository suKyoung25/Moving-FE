import { tokenFetch } from "@/lib/utils";

export async function fetchClientPendingQuotes() {
   try {
      return await tokenFetch("/estimates/pending", { method: "GET" });
   } catch (e) {
      throw e;
   }
}
