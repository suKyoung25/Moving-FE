import { UserType } from "@/lib/types";
import { SignUpFormValues } from "@/lib/schemas";
import { defaultFetch } from "@/lib/utils";

export default async function createSignUp(
   type: UserType,
   data: SignUpFormValues,
) {
   const url = `/auth/signup/${type}`;

   return await defaultFetch(url, {
      method: "POST",
      body: JSON.stringify(data),
   });
}
