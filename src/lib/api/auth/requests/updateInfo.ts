import { MoverBasicInfoInput } from "@/lib/schemas/dashboard.schema";
import { tokenFetch } from "@/lib/utils";

//기사님 기본정보 수정 api
export default async function updateInfo(data: MoverBasicInfoInput) {
   const url = "/dashboard/edit/mover";
   return await tokenFetch(url, {
      method: "PATCH",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   });
}
