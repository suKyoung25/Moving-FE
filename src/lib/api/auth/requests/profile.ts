import { MoverBasicInfoInput } from "@/lib/schemas/dashboard.schema";
import { MoverProfileRequestInput } from "@/lib/schemas/profile.schema";
import { tokenFetch } from "@/lib/utils";

//기사님 기본정보 수정 api
async function updateMoverInfo(data: MoverBasicInfoInput) {
   const url = "/dashboard/edit/mover";
   return await tokenFetch(url, {
      method: "PATCH",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });
}

//기사님 프로필 등록 api
async function createProfile(data: MoverProfileRequestInput) {
   const url = "/profile/mover";
   return await tokenFetch(url, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });
}

//기사님 프로필 수정 api
async function updateMoverProfile(data: MoverProfileRequestInput) {
   const url = "/profile/mover";
   return await tokenFetch(url, {
      method: "PATCH",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });
}

export { updateMoverInfo, createProfile, updateMoverProfile };
