"use client";

import {
   FormWizardAction,
   FormWizardContextType,
   FormWizardState,
} from "@/lib/types";

import {
   createContext,
   ReactNode,
   useContext,
   useEffect,
   useReducer,
} from "react";

// Context 초기 상태 정의
const initialState: FormWizardState = {
   moveType: undefined, // 이사 종류 (소형, 가정, 사무실)
   moveDate: undefined, // 이사 날짜
   fromAddress: undefined, // 출발지 주소
   toAddress: undefined, // 도착지 주소
   currentStep: 0, // 현재 진행 중인 스텝 (0 ~ 4)
};

/**
 * 현재 상태와 액션을 받아서 새로운 상태를 반환하는 함수
 * @param state - 현재 상태 객체
 * @param action - 상태 변경을 위한 액션 객체 (type + payload)
 * @returns 업데이트된 상태 객체
 */
function reducer(
   state: FormWizardState,
   action: FormWizardAction,
): FormWizardState {
   switch (action.type) {
      case "SET_MOVE_TYPE":
         return { ...state, moveType: action.payload }; // 이사 종류 상태 업데이트
      case "SET_MOVE_DATE":
         return { ...state, moveDate: action.payload }; // 이사 날짜 상태 업데이트
      case "SET_FROM_ADDRESS":
         return { ...state, fromAddress: action.payload }; // 출발지 주소 상태 업데이트
      case "SET_TO_ADDRESS":
         return { ...state, toAddress: action.payload }; // 도착지 주소 상태 업데이트
      case "INIT_FROM_STORAGE":
         return action.payload; // 로컬스토리지에 저장된 상태로 초기화
      case "NEXT_STEP":
         return { ...state, currentStep: state.currentStep + 1 }; // 다음 단계로 이동
      case "RESET_FORM_ONLY":
         return {
            moveType: undefined,
            moveDate: undefined,
            fromAddress: undefined,
            toAddress: undefined,
            currentStep: 4, // 요청 완료 시 완료 단계로 이동
         };
      default:
         return state; // 정의되지 않은 액션 타입일 경우 기존 상태 반환
   }
}

// Context 생성
const FormWizardContext = createContext<FormWizardContextType | null>(null);

// Context 사용할 수 있는 커스텀 훅
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
   const [state, dispatch] = useReducer(reducer, initialState);
   const goToNextStep = () => dispatch({ type: "NEXT_STEP" });

   // 새로고침 시에도 이전 입력값 유지
   useEffect(() => {
      const saved = localStorage.getItem("requestData");
      if (saved) {
         dispatch({ type: "INIT_FROM_STORAGE", payload: JSON.parse(saved) });
      }
   }, []);

   // 상태가 바뀔 때마다 로컬스토리지에 저장
   useEffect(() => {
      // 초기 상태일 경우 저장하지 않음
      if (
         state.currentStep === 0 &&
         !state.moveType &&
         !state.moveDate &&
         !state.fromAddress &&
         !state.toAddress
      ) {
         localStorage.removeItem("requestData");
      } else {
         localStorage.setItem("requestData", JSON.stringify(state));
      }
   }, [state]);

   return (
      <FormWizardContext.Provider value={{ state, dispatch, goToNextStep }}>
         {children}
      </FormWizardContext.Provider>
   );
};
