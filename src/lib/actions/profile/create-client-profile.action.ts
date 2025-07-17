"use server";

import { MOVE_TYPES } from "@/constants";
import { tokenFetch } from "@/lib/api/fetch-client";
import { ClientProfileData } from "@/lib/types";

type ClientProfileActionState = {
   success: boolean;
   message: string;
   data?: ClientProfileData;
};

export default async function createClientProfile(
   _: ClientProfileActionState | null | undefined,
   formData: FormData,
) {
   try {
      // FormData에서 데이터 추출
      const serviceTypes = formData.getAll("serviceType") as string[];
      const livingAreas = formData.getAll("livingArea") as string[];
      const profileImage = formData.get("profileImage") as string | null;

      if (
         !profileImage &&
         serviceTypes.length === 0 &&
         livingAreas.length === 0
      ) {
         return {
            success: false,
            message: "이미지, 서비스 유형, 지역 중 최소 하나는 선택해주세요.",
         };
      }

      // FE -> BE 데이터 형태 변환
      const parsedData: ClientProfileData = {
         profileImage: profileImage || undefined,
         serviceType: serviceTypes.map(
            (type) => MOVE_TYPES[type as keyof typeof MOVE_TYPES],
         ),
         livingArea: livingAreas as string[],
      };

      // ❌ BE 연동 : 이미지 들어가면 JSON 쓰면 안 되는데 일단 구현 때문에 넣음. 나중에 수정 예정.
      const response = await tokenFetch("/profile/clients", {
         method: "PATCH",
         body: JSON.stringify(parsedData),
      });

      return {
         success: true,
         message: "일반 회원 프로필이 성공적으로 생성되었습니다.",
         data: response,
      };
   } catch (error) {
      console.error("일반 회원 프로필 생성 실패: ", error);
   }
}
