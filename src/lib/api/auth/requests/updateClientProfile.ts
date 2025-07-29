import {
   ClientProfilePostValue,
   ClientProfileUpdateValue,
} from "@/lib/schemas";
import { tokenFetch, tokenSettings } from "@/lib/utils";

export default async function updateClientProfile(
   data: ClientProfilePostValue | ClientProfileUpdateValue,
) {
   const res = await tokenFetch("/profile/clients", {
      method: "PATCH",
      body: JSON.stringify(data),
   });

   tokenSettings.set(res.accessToken);

   return res;
}
