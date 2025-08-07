import { tokenFetch } from "@/lib/utils";

export async function cancelRequest(requestId: string) {
   return await tokenFetch(`/requests/${requestId}`, {
      method: "DELETE",
   });
}
