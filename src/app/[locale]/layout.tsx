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

   const baseUrl = "https://moving-web.site";

   return {
      metadataBase: new URL(baseUrl),
      title: t("title"),
      description: t("description"),
      alternates: {
         canonical: baseUrl,
      },
      robots: {
         index: true,
         follow: true,
      },
      icons: {
         icon: "/favicon.ico",
      },
      openGraph: {
         title: t("title"),
         description: t("description"),
         url: baseUrl,
         siteName: "Moving",
         images: [
            {
               url: `${baseUrl}/seo.png`,
               width: 1200,
               height: 630,
               alt: "Moving site preview image",
            },
         ],
         locale: "ko_KR",
         type: "website",
      },
      twitter: {
         card: "summary_large_image",
         title: t("title"),
         description: t("description"),
         images: [`${baseUrl}/seo.png`],
      },
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
