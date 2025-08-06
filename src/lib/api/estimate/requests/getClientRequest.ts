import { tokenFetch } from "@/lib/utils/fetch-client";
interface PageParms {
   cursor?: string;
   sort?: "asc" | "desc";
}

export async function getClientActiveRequest() {
   return await tokenFetch("/requests/client/active");
}

export async function getRequests({ cursor, sort }: PageParms) {
   const queryParams = new URLSearchParams();
   queryParams.append("sort", sort as string);
   if (cursor) queryParams.append("cursor", cursor);

   return await tokenFetch(`/requests/client?${queryParams.toString()}`);
}
