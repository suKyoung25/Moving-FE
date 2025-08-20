import { tokenFetch } from "@/lib/utils";

export async function deleteReply(id: string) {
   try {
      return await tokenFetch(`/community/reply/${id}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
      });
   } catch (e) {
      throw e;
   }
}
