import { MoverBasicInfoInput } from "@/lib/schemas/dashboard.schema";
import { tokenFetch } from "@/lib/utils";

//기사님 기본정보 수정 api
export default async function updateMoverBasicInfo(data: MoverBasicInfoInput) {
   const url = "/dashboard/edit/mover";
   return await tokenFetch(url, {
      method: "PATCH",
      body: JSON.stringify(data),
   });
}
