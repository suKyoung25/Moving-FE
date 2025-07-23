import { MoverProfileRequestInput } from "@/lib/schemas/profile.schema";
import { tokenFetch } from "@/lib/utils";

//기사님 프로필 등록 api
async function createProfile(data: MoverProfileRequestInput) {
   //디버깅
   console.log("프로필 등록 api 시작");

   const url = "/profile/mover";
   return await tokenFetch(url, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });
}

export default createProfile;
