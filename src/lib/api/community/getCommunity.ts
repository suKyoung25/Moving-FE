import { defaultFetch } from "@/lib/utils";

export default async function getCommunity(id: string) {
   try {
      return await defaultFetch(`/community/${id}`, { method: "GET" });
   } catch (e) {
      throw e;
   }
}
