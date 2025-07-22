"use server";

import { cookies } from "next/headers";

// 서버 사이드 전용 함수
export async function getServerSideToken(type: string) {
   const cookieStore = await cookies();
   const token = cookieStore.get(type);
   return token ? token.value : null;
}
