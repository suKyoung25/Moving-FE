import { ClientProfilePostValue } from "@/lib/schemas";
import { tokenFetch, tokenSettings } from "@/lib/utils";

export default async function createClientProfile(
   data: ClientProfilePostValue,
) {
   const res = await tokenFetch("/profile/clients", {
      method: "PATCH",
      body: JSON.stringify(data),
   });

   // 프로필 등록 후 토큰 재발급
   tokenSettings.set(res.data.accessToken);

   return res;
}
