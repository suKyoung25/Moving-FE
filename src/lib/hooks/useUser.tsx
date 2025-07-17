import { useAuth } from "@/context/AuthContext";
import { isClient, isMover } from "@/lib/types/auth.type";

// userType 보는 함수
export function useUser() {
   const { user, ...rest } = useAuth();

   return {
      user,
      isClient: user ? isClient(user) : false,
      isMover: user ? isMover(user) : false,
      clientUser: user && isClient(user) ? user : null,
      moverUser: user && isMover(user) ? user : null,
      ...rest,
   };
}
