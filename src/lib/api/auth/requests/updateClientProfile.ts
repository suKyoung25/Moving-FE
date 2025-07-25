import { ClientProfileUpdateValue } from "@/lib/schemas";
import { tokenFetch } from "@/lib/utils";

export default async function updateClientProfile(
   data: ClientProfileUpdateValue,
) {
   await tokenFetch("/profile/clients", {
      method: "PATCH",
      body: JSON.stringify(data),
   });
}
