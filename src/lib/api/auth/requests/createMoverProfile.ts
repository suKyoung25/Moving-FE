import { MoverProfileRequestInput } from "@/lib/schemas/profile.schema";
import { tokenFetch } from "@/lib/utils";

//TODO: 삭제 예정 기사님 프로필 등록 api
export default async function createMoverProfile(
   data: MoverProfileRequestInput,
) {
   const url = "/profile/mover";
   return await tokenFetch(url, {
      method: "POST",
      body: JSON.stringify(data),
   });
}
