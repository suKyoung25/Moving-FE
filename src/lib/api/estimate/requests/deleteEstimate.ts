import { tokenFetch } from "@/lib/utils";

export async function deleteEstimate(id: string) {
   try {
      const { data } = await tokenFetch(`/estimates/${id}`, {
         method: "DELETE",
      });

      return data;
   } catch (error) {
      console.error("deleteSentEstimate error:", error);
      return null;
   }
}
