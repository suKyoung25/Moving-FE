import { defaultFetch } from "@/lib/utils";

export default async function getCommunityAll(offset: number, search?: string) {
   try {
      return await defaultFetch(
         `/community?offset=${offset}&search=${search}`,
         {
            method: "GET",
         },
      );
   } catch (e) {
      throw e;
   }
}
