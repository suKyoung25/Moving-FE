"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import RouterGuardLayout from "@/components/layout/RouterGuardLayout";
import { FormWizardProvider } from "@/context/FormWizardContext";

export function Providers({ children }: { children: ReactNode }) {
   const [queryClient] = useState(() => new QueryClient());

   return (
      <AuthProvider>
         <RouterGuardLayout>
            <QueryClientProvider client={queryClient}>
               <NotificationProvider>
                  <FormWizardProvider>{children}</FormWizardProvider>
               </NotificationProvider>
            </QueryClientProvider>
         </RouterGuardLayout>
      </AuthProvider>
   );
}
