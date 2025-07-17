import { cookies } from "next/headers";

// 서버 환경에서 토큰 받는 함수
export async function getServerSideToken(type: string): Promise<string | null> {
   const cookieStore = await cookies();
   const token = cookieStore.get(type);
   return token ? token.value : null;
}

// 서버 환경에서 토큰 설정하는 함수
// export async function setServerSideTokens(
//    accessToken: string,
//    refreshToken: string,
// ) {
//    const cookieStore = await cookies();

//    //  토큰 디코딩 및 만료 시간 계산
//    const accessTokenData = JSON.parse(Buffer.from(accessToken.split(".")[1]));
// }
