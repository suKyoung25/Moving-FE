import { MoverProfileRequestInput } from "@/lib/schemas/profile.schema";
import { tokenFetch, tokenSettings } from "@/lib/utils";

//기사님 프로필 수정 api
export default async function updateMoverProfile(
   data: MoverProfileRequestInput,
) {
   const url = "/profile/mover";
   const res = await tokenFetch(url, {
      method: "PATCH",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });
   console.log(res);

   tokenSettings.set(res.accessToken);

   return { ...res };
}
