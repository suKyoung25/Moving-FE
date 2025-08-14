import type { Metadata } from "next";
import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Providers } from "@/app/providers";
import SupportHub from "@/components/layout/SupportHub";

export async function generateMetadata(): Promise<Metadata> {
   const t = await getTranslations("Layout");

   return {
      title: t("title"),
      description: t("description"),
   };
}

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
            <NextIntlClientProvider locale={locale}>
               <Providers>
                  <main>
                     {children}
                     <SupportHub />
                  </main>
               </Providers>
            </NextIntlClientProvider>
         </body>
      </html>
   );
}
