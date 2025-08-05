import type { Metadata } from "next";
import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/app/providers";
import { ToastProvider } from "@/context/ToastConText";
import ToastContainer from "@/components/common/ToastContainer";

export const metadata: Metadata = {
   title: "무빙 - 스마트한 이사 비교 플랫폼",
   description:
      "이사업체 견적을 한눈에 비교하고, 합리적인 선택을 돕는 스마트한 이사 플랫폼 '무빙'",
};

export default async function RootLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: string }>;
}>) {
   const { locale } = await params;
   if (!hasLocale(routing.locales, locale)) {
      notFound();
   }

   return (
      <html lang={locale}>
         <body className="h-full min-h-screen">
            <NextIntlClientProvider>
               <Providers>
                  <ToastProvider>
                     <main>{children}</main>
                     <ToastContainer />
                  </ToastProvider>
               </Providers>
            </NextIntlClientProvider>
         </body>
      </html>
   );
}
