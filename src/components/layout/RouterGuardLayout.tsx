"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { matchPath, removeLocalePrefix } from "@/lib/utils";
import Spinner from "../common/Spinner";

const PROFILE_CREATE_PATH = "/profile/create";
// const guestPaths = ["/", "/sign-in", "/sign-up"];  //TODO: 추후 삭제 필요
const guestPaths = ["/"];
const moverPaths = ["/dashboard", "/received-requests", "/my-quotes/mover"];
const clientPaths = [
   "/favorite-movers",
   "/my-quotes/client",
   "/request",
   "/reviews",
];

export default function RouterGuardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const router = useRouter();
   const pathname = usePathname();
   const { user, isLoading } = useAuth();
   const rawPath = pathname?.split("?")[0] || "";

   const path = removeLocalePrefix(rawPath);
   const isGuestRoute = matchPath(path, guestPaths);
   const isMoverRoute = matchPath(path, moverPaths);
   const isClientRoute = matchPath(path, clientPaths);

   const [canRender, setCanRender] = useState(false);

   useEffect(() => {
      if (isLoading) return;

      // 기본값 false 상태에서 조건에 따라 true로 바꿈
      let allow = true;

      if (!user) {
         if (isMoverRoute || isClientRoute || path.startsWith("/profile")) {
            router.replace("/sign-in/client");
            allow = false;
         }
      } else {
         const { isProfileCompleted, userType } = user;

         if (isGuestRoute) {
            router.replace("/mover-search");
            allow = false;
         } else if (!isProfileCompleted && path !== PROFILE_CREATE_PATH) {
            router.replace(PROFILE_CREATE_PATH);
            allow = false;
         } else if (isProfileCompleted && path === PROFILE_CREATE_PATH) {
            router.replace("/mover-search");
            allow = false;
         } else if (userType === "client" && isMoverRoute) {
            router.replace("/mover-search");
            allow = false;
         } else if (userType === "mover" && isClientRoute) {
            router.replace("/mover-search");
            allow = false;
         }
      }

      // 최종 렌더 가능 여부 설정
      setCanRender(allow);
   }, [
      user,
      isLoading,
      path,
      isGuestRoute,
      isMoverRoute,
      isClientRoute,
      router,
   ]);

   if (isLoading || !canRender) return <Spinner />;

   return <>{children}</>;
}
