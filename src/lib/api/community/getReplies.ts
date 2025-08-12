import { defaultFetch } from "@/lib/utils";

export default async function getReplies(communityId: string) {
   try {
      return await defaultFetch(`/community/${communityId}/replies`, {
         method: "GET",
      });
   } catch (e) {
      throw e;
   }
}
