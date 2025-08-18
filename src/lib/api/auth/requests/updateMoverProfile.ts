import { MoverProfileRequestInput } from "@/lib/schemas/profile.schema";
import { tokenFetch, tokenSettings } from "@/lib/utils";

//기사님 프로필 수정 api
export default async function updateMoverProfile(
   data: MoverProfileRequestInput,
) {
   console.log("=== API 요청 디버깅 ===");
   console.log("1. 전송할 데이터:", JSON.stringify(data, null, 2));
   console.log("2. 위치 정보:", {
      serviceArea: data.serviceArea,
   });
   console.log("3. 데이터 타입 확인:", {
      serviceAreaType: typeof data.serviceArea,
   });

   const url = "/profile/mover";
   const res = await tokenFetch(url, {
      method: "PATCH",
      body: JSON.stringify(data),
   });

   console.log("4. 서버 응답:", res);

   tokenSettings.set(res.accessToken);
   return { ...res };
}
