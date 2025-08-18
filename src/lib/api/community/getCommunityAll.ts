import { defaultFetch } from "@/lib/utils";

export default async function getCommunityAll(
   offset: number,
   search?: string,
   locale?: string,
) {
   try {
      return await defaultFetch(
         `/community?offset=${offset}&search=${search}&targetLang=${locale}`,
         {
            method: "GET",
         },
      );
   } catch (e) {
      throw e;
   }
}
