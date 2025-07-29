"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
   const [queryClient] = useState(() => new QueryClient());

   return (
      <AuthProvider>
         <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-center" />
         </QueryClientProvider>
      </AuthProvider>
   );
}
