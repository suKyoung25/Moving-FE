import isFetchError from "../utils/fetch-error.util";
import { tokenFetch } from "./fetch-client";

const authApi = {
   // signUp: (name,),

   getMe: async () => {
      try {
         const response = await tokenFetch("/auth", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
         });

         if (response?.user) {
            return { user: response.user };
         }

         return null;
      } catch (error: unknown) {
         console.error("사용자 정보 api 호출 실패", error);

         // 정상적인 로그아웃
         if (isFetchError(error) && error.status === 401) {
            return null;
         }

         throw error;
      }
   },
};

export default authApi;
