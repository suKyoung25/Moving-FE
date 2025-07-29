// ===== getClientRequest.ts =====
import { tokenFetch } from "@/lib/utils/fetch-client";

export async function getClientActiveRequests() {
  return await tokenFetch('/requests/client/active', {
    method: 'GET',
  });
}