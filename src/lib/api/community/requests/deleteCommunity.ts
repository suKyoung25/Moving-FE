import { tokenFetch } from "@/lib/utils";

export async function deleteCommunity(id: string) {
   try {
      return await tokenFetch(`/community/${id}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
      });
   } catch (e) {
      throw e;
   }
}
