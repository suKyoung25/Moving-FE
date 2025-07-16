"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRoleGuard({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, isLoading } = useAuth();
   const pathname = usePathname();
   const router = useRouter();

   useEffect(() => {
      if (!isLoading) {
         if (!user) {
            router.replace("/sign-in/client");
            return;
         }

         // 경로 기반 라우팅 제어
         const clientOnlyPaths = [
            "/request",
            "/reviews",
            "/favorite-movers",
            "/my-quotes/client",
         ];
         const moverOnlyPaths = [
            "/received-requests",
            "/dashboard",
            "/my-quotes/mover",
         ];

         if (
            clientOnlyPaths.some((path) => pathname.startsWith(path)) &&
            user.userType !== "client"
         ) {
            router.push("/mover-search");
            return;
         }

         if (
            moverOnlyPaths.some((path) => pathname.startsWith(path)) &&
            user.userType !== "mover"
         ) {
            router.push("/mover-search");
            return;
         }
      }
   }, [user, isLoading, pathname, router]);

   if (isLoading || !user) return null;
   return <>{children}</>;
}
