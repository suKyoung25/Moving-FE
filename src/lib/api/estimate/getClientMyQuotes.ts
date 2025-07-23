import { tokenFetch } from "@/lib/utils";

export async function fetchClientPendingQuotes() {
   return await tokenFetch("/estimates/pending", { method: "GET" });
}

export async function fetchClientReceivedQuotes(category: string) {
   return await tokenFetch(`/estimates/received?category=${category}`, {
      method: "GET",
   });
}
