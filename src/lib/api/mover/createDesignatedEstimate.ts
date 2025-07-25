import { tokenFetch } from "@/lib/utils/fetch-client";

export async function createDesignatedEstimate(moverId: string, requestId: string) {
  return await tokenFetch(`/movers/${moverId}`, {
    method: 'PATCH',
    body: JSON.stringify({ requestId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}