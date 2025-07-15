"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UnauthOnlyGuard({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, isLoading } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!isLoading && user) {
         router.push("/mover-search"); // 로그인했으면 홈으로 이동
      }
   }, [user, isLoading, router]);

   if (isLoading) return null;
   return <>{children}</>;
}
