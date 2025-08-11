import { tokenFetch } from "@/lib/utils/fetch-client";
interface PageParms {
   cursor?: string;
   sort?: "asc" | "desc";
}

export async function getClientActiveRequest(targetLang?: string) {
   return await tokenFetch(`/requests/client/active?targetLang=${targetLang}`);
}

export async function getRequests(
   { cursor, sort }: PageParms,
   targetLang?: string,
) {
   const queryParams = new URLSearchParams();
   queryParams.append("sort", sort as string);
   if (cursor) queryParams.append("cursor", cursor);

   return await tokenFetch(
      `/requests/client?targetLang=${targetLang}&${queryParams.toString()}`,
   );
}

export async function getRequest(requestId: string, targetLang?: string) {
   return await tokenFetch(`/requests/${requestId}?targetLang=${targetLang}`);
}
