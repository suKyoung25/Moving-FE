import { defaultFetch } from "@/lib/utils";

export default async function getReplies(communityId: string, locale?: string) {
   try {
      return await defaultFetch(
         `/community/${communityId}/replies?targetLang=${locale}`,
         {
            method: "GET",
         },
      );
   } catch (e) {
      throw e;
   }
}
