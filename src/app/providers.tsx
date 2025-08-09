"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import RouterGuardLayout from "@/components/layout/RouterGuardLayout";
import { FormWizardProvider } from "@/context/FormWizardContext";
import ToastContainer from "@/components/common/ToastContainer";
import { ToastProvider } from "@/context/ToastConText";

export function Providers({ children }: { children: ReactNode }) {
   const [queryClient] = useState(() => new QueryClient());

   return (
      <AuthProvider>
         <RouterGuardLayout>
            <QueryClientProvider client={queryClient}>
               <NotificationProvider>
                  <ToastProvider>
                     <FormWizardProvider>{children}</FormWizardProvider>
                     <ToastContainer />
                  </ToastProvider>
               </NotificationProvider>
            </QueryClientProvider>
         </RouterGuardLayout>
      </AuthProvider>
   );
}
