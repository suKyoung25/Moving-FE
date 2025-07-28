import { ClientProfilePostValue } from "@/lib/schemas";
import { tokenFetch } from "@/lib/utils";

export default async function createClientProfile(
   data: ClientProfilePostValue,
) {
   await tokenFetch("/profile/clients", {
      method: "PATCH",
      body: JSON.stringify(data),
   });
}
