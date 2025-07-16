"use client";

import AuthSpinner from "@/components/spinner/AuthSpinner";
import authApi from "@/lib/api/auth.api";
import { User } from "@/lib/types/auth.type";
import { accessTokenSettings } from "@/lib/utils/auth.util";
import isFetchError from "@/lib/utils/fetch-error.util";
import { useRouter } from "next/navigation";
import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useMemo,
   useState,
} from "react";
import { delay } from "../../delay";

// ✅ type 등
interface AuthContextType {
   user: User | null;
   isLoading: boolean;
   login: (user: User, accessToken: string) => void;
   logout: () => void;
   refreshUser: () => Promise<void>;
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

//  context 생성
const AuthContext = createContext<AuthContextType | null>(null);

// ✅ context 값 설정
export function AuthProvider({ children }: { children: React.ReactNode }) {
   const router = useRouter();
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true); // 기본값 true로 시작

   console.log("User : ", user); // 나중에 삭제

   const login = useCallback((user: User, accessToken: string) => {
      accessTokenSettings.set(accessToken);
      setUser(user);
   }, []);

   const logout = useCallback(() => {
      setUser(null);
      accessTokenSettings.clear();
      location.href = "/sign-in/client"; // 임시
   }, [setUser, router]);

   const refreshUser = useCallback(async () => {
      setIsLoading(true);
      if (!accessTokenSettings.get()) {
         setUser(null);
         setIsLoading(false);
         return;
      }

      try {
         await delay(1000);
         const response = await authApi.getMe();
         if (response?.user) setUser(response.user);
         else setUser(null);
      } catch (error) {
         console.error("사용자 정보 호출 실패: ", error);
         if (isFetchError(error) && error.status === 401) {
            setUser(null);
            accessTokenSettings.clear();
         }
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      if (user) return;
      refreshUser();
   }, [user, refreshUser]);

   const value = useMemo<AuthContextType>(
      () => ({
         user,
         isLoading,
         login,
         logout,
         refreshUser,
         setUser,
      }),
      [user, isLoading, login, logout, refreshUser, setUser],
   );

   if (isLoading) return <AuthSpinner />;

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// context 값 불러옴
export function useAuth() {
   const context = useContext(AuthContext);
   if (!context)
      throw new Error("AuthProvider 안에서만 useAuth를 사용할 수 있습니다.");

   return context;
}
