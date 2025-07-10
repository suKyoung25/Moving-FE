import { AuthProvider } from "@/context/AuthContext";
import { FormWizardProvider } from "@/context/FormWizardContext";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FormWizardProvider>{children}</FormWizardProvider>
    </AuthProvider>
  );
}
