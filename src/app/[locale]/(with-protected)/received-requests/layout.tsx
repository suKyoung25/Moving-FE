"use client";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Layout({ children }: { children: React.ReactNode }) {
   const queryClient = new QueryClient();

   return (
      <QueryClientProvider client={queryClient}>
         <Header />
         <DefaultLayout>{children}</DefaultLayout>
      </QueryClientProvider>
   );
}
