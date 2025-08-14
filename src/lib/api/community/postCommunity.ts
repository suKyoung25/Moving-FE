import { tokenFetch } from "@/lib/utils";

export async function postCommunity(title: string, content: string) {
   try {
      return await tokenFetch("/community", {
         method: "POST",
         body: JSON.stringify({ title, content }),
         headers: {
            "Content-Type": "application/json",
         },
      });
   } catch (e) {
      throw e;
   }
}
