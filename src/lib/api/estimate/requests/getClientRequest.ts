import { tokenFetch } from "@/lib/utils/fetch-client";

export async function getClientActiveRequest() {
   return await tokenFetch("/requests/client/active", {
      method: "GET",
   });
}
