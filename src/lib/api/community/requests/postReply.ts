import { tokenFetch } from "@/lib/utils";

export async function postReply(id: string, content: string) {
   try {
      return await tokenFetch(`/community/${id}/replies`, {
         method: "POST",
         body: JSON.stringify({ content }),
         headers: {
            "Content-Type": "application/json",
         },
      });
   } catch (e) {
      throw e;
   }
}
