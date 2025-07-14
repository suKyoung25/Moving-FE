"use client";

import authApi from "@/lib/api/auth.api";
import { User } from "@/lib/types/auth.type";
import { accessTokenSettings } from "@/lib/utils/auth.util";
import isFetchError from "@/lib/utils/fetch-error.util";
import { usePathname, useRouter } from "next/navigation";
import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useMemo,
   useState,
} from "react";

// ✅ type 등
interface AuthContextType {
   user: User | null;
   isLoading: boolean;
   login: (user: User, accessToken: string) => void;
   logout: () => void;
   refreshUser: () => Promise<void>;
}

//  context 생성
const AuthContext = createContext<AuthContextType | null>(null);

// ✅ context 값 설정
export function AuthProvider({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const router = useRouter();
   const [user, setUser] = useState<User | null>(null); // 이용자 정보
   const [isLoading, setIsLoading] = useState(false);

   // ★ 인증 함수 목록
   const login = useCallback((user: User, accessToken: string) => {
      accessTokenSettings.set(accessToken);
      setUser(user);
   }, []);

   const logout = useCallback(() => {
      setUser(null);
      accessTokenSettings.clear();
      router.push("/login");
   }, [router]);

   const refreshUser = useCallback(async () => {
      if (!accessTokenSettings.get()) {
         setUser(null);
         return;
      }

      setIsLoading(true);

      try {
         const response = await authApi.getMe();
         if (response?.user) {
            setUser(response.user);
         } else {
            setUser(null);
         }
      } catch (error: unknown) {
         console.error("사용자 정보 호출 실패: ", error);

         if (isFetchError(error) && error.status === 401) {
            setUser(null);
            accessTokenSettings.clear();
         }
      } finally {
         setIsLoading(false);
      }
   }, []);

   // ✅ 페이지 이동 시 로그인 유지
   useEffect(() => {
      refreshUser();
   }, [pathname, refreshUser]);

   // 반환
   const value = useMemo<AuthContextType>(
      () => ({
         user,
         isLoading,
         login,
         logout,
         refreshUser,
      }),
      [user, isLoading, login, logout, refreshUser],
   );

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// context 값 불러옴
export function useAuth() {
   const context = useContext(AuthContext);
   if (!context)
      throw new Error("AuthProvider 안에서만 useAuth를 사용할 수 있습니다.");

   return context;
}
