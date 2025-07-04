"use client";

import {
  ChildrenProps,
  FormWizardAction,
  FormWizardContextType,
  FormWizardState,
} from "@/types";

import { createContext, useContext, useReducer, useState } from "react";

const initialState: FormWizardState = {
  moveType: null,
  moveDate: null,
  fromAddress: null,
  toAddress: null,
};

function reducer(
  state: FormWizardState,
  action: FormWizardAction
): FormWizardState {
  switch (action.type) {
    case "SET_MOVE_TYPE":
      return { ...state, moveType: action.payload };
    case "SET_MOVE_DATE":
      return { ...state, moveDate: action.payload };
    case "INIT_STATE":
      return { ...action.payload };
    default:
      return state;
  }
}

const FormWizardContext = createContext<FormWizardContextType | null>(null);

export const useFormWizard = () => {
  const context = useContext(FormWizardContext);
  if (!context) {
    throw new Error("useFormWizard must be used within an FormWizardProvider");
  }
  return context;
};

export const FormWizardProvider = ({ children }: ChildrenProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPrevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <FormWizardContext.Provider
      value={{ state, dispatch, currentStep, goToNextStep, goToPrevStep }}
    >
      {children}
    </FormWizardContext.Provider>
  );
};
