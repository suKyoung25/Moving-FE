import { tokenFetch } from "../fetch-client";

export async function fetchPendingQuotes() {
   return await tokenFetch("/estimates/pending", { method: "GET" });
}
