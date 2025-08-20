import { UserType } from "@/lib/types";
import { SignInFormValues } from "@/lib/schemas";
import { defaultFetch } from "@/lib/utils";

export default async function createSignIn(
   type: UserType,
   data: SignInFormValues,
) {
   const url = `/auth/signin/${type}`;

   return await defaultFetch(url, {
      method: "POST",
      body: JSON.stringify(data),
   });
}
