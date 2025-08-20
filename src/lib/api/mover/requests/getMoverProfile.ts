// lib/api/mover/getMoverProfile.ts
import { Mover } from "@/lib/types";
import { tokenFetch } from "@/lib/utils";

/**
 * 현재 로그인한 기사님의 프로필 정보를 가져옵니다.
 */
export async function getMoverProfile(targetLang?: string): Promise<Mover> {
   const response = await tokenFetch(
      `/movers/profile?targetLang=${targetLang}`,
      {
         method: "GET",
      },
   );

   return response.data || response;
}

/**
 * 기사님 프로필 존재 여부 확인
 */
export async function checkMoverProfileExists(): Promise<boolean> {
   try {
      await getMoverProfile();
      return true;
   } catch {
      return false;
   }
}
