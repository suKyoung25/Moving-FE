import { tokenFetch } from "@/lib/utils";

export async function fetchClientPendingQuotes() {
   return await tokenFetch("/estimates/pending", { method: "GET" });
}

export async function fetchClientReceivedQuotes() {
   return await tokenFetch("/estimates/received", { method: "GET" });
}
