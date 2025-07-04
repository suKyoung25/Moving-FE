import { FormWizardProvider } from "@/context/FormWizardContext";
import { ChildrenProps } from "@/types";
import React from "react";

export default function Providers({ children }: ChildrenProps) {
  return <FormWizardProvider>{children}</FormWizardProvider>;
}
