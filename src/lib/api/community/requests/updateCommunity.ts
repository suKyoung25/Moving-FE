import { tokenFetch } from "@/lib/utils";

export async function updateCommunity(
   id: string,
   title: string,
   content: string,
) {
   try {
      return await tokenFetch(`/community/${id}`, {
         method: "PATCH",
         body: JSON.stringify({ title, content }),
         headers: {
            "Content-Type": "application/json",
         },
      });
   } catch (e) {
      throw e;
   }
}
