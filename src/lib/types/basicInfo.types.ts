import { ValidationResult } from "./profile.types";

//기사님 기본정보 컴포넌트 모음집
export interface BasicInfoInputProps {
   name: string; //useActionsState로 매핑하기 위한
   text: string;
   placeholder: string;
   defaultValue?: string;
   onValidChange: (name: string, value: boolean) => void;
   validator: (value: string) => ValidationResult; // 유효성 검사 함수
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
