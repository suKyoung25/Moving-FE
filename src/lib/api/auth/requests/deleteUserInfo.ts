import { WithdrawFormValues } from "@/lib/schemas";
import { UserType } from "@/lib/types";
import { tokenFetch } from "@/lib/utils";

// 일반유저/기사님 회원탈퇴 api
export default async function deleteUserInfo(
   type: UserType,
   data: WithdrawFormValues,
) {
   const url = `/auth/delete/${type}`;

   return await tokenFetch(url, {
      method: "DELETE",
      body: JSON.stringify(data),
   });
}
