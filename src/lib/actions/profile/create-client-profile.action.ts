import { MOVE_TYPES } from "@/constants";

export default async function createClientProfile(_: any, formData: FormData) {
   try {
      // FormData에서 데이터 추출
      const serviceTypes = formData.getAll("serviceType");
      const livingAreas = formData.getAll("livingArea");
      const profileImage = formData.get("profileImage");

      // FE -> BE 데이터 형태 변환
      const parsedData = {
         profileImage: profileImage || undefined,
         serviceType:
            serviceTypes.map(
               (type) => MOVE_TYPES[type as keyof typeof MOVE_TYPES],
            ) || undefined,
         livingArea: livingAreas || undefined,
      };

      console.log("전송 데이터 형태: ", parsedData);

      return { success: true };
   } catch (error) {
      console.error("프로필 업데이트 실패: ", error);
   }
}
