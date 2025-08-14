import { defaultFetch } from "@/lib/utils/fetch-client";
import { UserType } from "@/lib/types";
import { SignUpFormValues } from "@/lib/schemas";

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
