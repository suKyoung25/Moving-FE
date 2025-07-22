import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
   title: "무빙 - 스마트한 이사 비교 플랫폼",
   description:
      "이사업체 견적을 한눈에 비교하고, 합리적인 선택을 돕는 스마트한 이사 플랫폼 '무빙'",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="ko">
         <body className="h-full min-h-screen">
            <AuthProvider>
               <main>{children}</main>
            </AuthProvider>
         </body>
      </html>
   );
}
