"use client";

// import AuthSpinner from "@/components/spinner/AuthSpinner";
import authApi from "@/lib/api/auth/requests/getMe";
import { User } from "@/lib/types/auth.types";
import { tokenSettings } from "@/lib/utils/auth.util";
import isFetchError from "@/lib/utils/fetch-error.util";
import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useMemo,
   useState,
} from "react";
import { delay } from "../../delay";
import Spinner from "@/components/common/Spinner";

// ✅ type 등
interface AuthContextType {
   user: User | null;
   isLoading: boolean;
   getUser: (user: User, accessToken: string) => void;
   logout: () => void;
   refreshUser: () => Promise<void>;
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// ✅ context 생성
const AuthContext = createContext<AuthContextType | null>(null);

// ✅ context 값 설정
export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true); // 기본값 true로 시작

   const getUser = useCallback((user: User, accessToken: string) => {
      try {
         tokenSettings.set(accessToken);
         setUser(user);
      } catch (error) {
         console.error("사용자 정보를 불러오는 데 실패했습니다: ", error);
         setUser(null);
      }
   }, []);

   const logout = useCallback(() => {
      tokenSettings.clear();
      setUser(null);
      location.href = "/mover-search";
   }, [setUser]);

   const refreshUser = useCallback(async () => {
      setIsLoading(true);

      if (!tokenSettings.get()) {
         setUser(null);
         setIsLoading(false);
         return;
      }

      try {
         await delay(200);

         const response = await authApi.getMe();

         if (response?.user) setUser(response.user);
         else setUser(null);
      } catch (error) {
         console.error("사용자 정보 호출 실패: ", error);

         // 토큰 날아갔을 때
         if (isFetchError(error) && error.status === 401) {
            setUser(null);
            tokenSettings.clear();
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
         getUser,
         logout,
         refreshUser,
         setUser,
      }),
      [user, isLoading, getUser, logout, refreshUser, setUser],
   );

   // 로딩 시 불러올 화면
   if (isLoading) return <Spinner />;

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ context 값 불러옴
export function useAuth() {
   const context = useContext(AuthContext);
   if (!context)
      throw new Error("AuthProvider 안에서만 useAuth를 사용할 수 있습니다.");

   return context;
}
