import { tokenFetch } from "@/lib/utils";

export async function updateReply(id: string, content: string) {
   try {
      return await tokenFetch(`/community/reply/${id}`, {
         method: "PATCH",
         body: JSON.stringify({ content }),
         headers: {
            "Content-Type": "application/json",
         },
      });
   } catch (e) {
      throw e;
   }
}
