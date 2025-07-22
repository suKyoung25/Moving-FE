import { tokenFetch } from "@/lib/utils";

export async function fetchClientPendingQuotes() {
   return await tokenFetch("/estimates/pending", { method: "GET" });
}
