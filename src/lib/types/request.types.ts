export interface Request {
  id: number;
  clientId: string;
  moverId: string;
  moveType: "small" | "home" | "office";
  moveDate: Date;
  fromAddress: string;
  toAddress: string;
  isDesignated: boolean;
  requestStatus: "pending" | "confirmed" | "rejected";
  rejectedReason?: string;
  requestedAt: Date;
}

// 각 단계에서 입력받는 데이터 구조
export interface FormWizardState {
  moveType: Request["moveType"] | undefined;
  moveDate: Request["moveDate"] | undefined;
  fromAddress: Request["fromAddress"] | undefined;
  toAddress: Request["toAddress"] | undefined;
  currentStep: number;
}

// 액션 타입
export type FormWizardAction =
  | { type: "SET_MOVE_TYPE"; payload: FormWizardState["moveType"] }
  | { type: "SET_MOVE_DATE"; payload: Date }
  | { type: "SET_FROM_ADDRESS"; payload: FormWizardState["fromAddress"] }
  | { type: "SET_TO_ADDRESS"; payload: FormWizardState["toAddress"] }
  | { type: "NEXT_STEP" }
  | { type: "INIT_FROM_STORAGE"; payload: FormWizardState };

// 컨텍스트의 value 타입
export interface FormWizardContextType {
  state: FormWizardState;
  dispatch: React.Dispatch<FormWizardAction>;
  goToNextStep: () => void;
}
