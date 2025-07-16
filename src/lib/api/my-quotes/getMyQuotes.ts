import { tokenFetch } from "../fetch-client";

export async function fetchPendingQuotes() {
   return await tokenFetch("/estimates/estimates/pending", { method: "GET" });
}
