"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export interface FormWizardContextType {
   currentStep: number;
   setCurrentStep: (val: number) => void;
   isPending: boolean;
   setIsPending: (val: boolean) => void;
}

const FormWizardContext = createContext<FormWizardContextType | null>(null);

export const useFormWizard = () => {
   const context = useContext(FormWizardContext);
   if (!context) {
      throw new Error(
         "useFormWizard must be used within an FormWizardProvider",
      );
   }
   return context;
};

export const FormWizardProvider = ({ children }: { children: ReactNode }) => {
   const [currentStep, setCurrentStep] = useState(0);
   const [isPending, setIsPending] = useState(true);

   return (
      <FormWizardContext.Provider
         value={{ currentStep, setCurrentStep, isPending, setIsPending }}
      >
         {children}
      </FormWizardContext.Provider>
   );
};
