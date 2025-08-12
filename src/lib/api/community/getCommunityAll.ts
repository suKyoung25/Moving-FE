import { defaultFetch } from "@/lib/utils";

export default async function getCommunityAll(offset: number) {
   try {
      return await defaultFetch(`/community?offset=${offset}`, {
         method: "GET",
      });
   } catch (e) {
      throw e;
   }
}
