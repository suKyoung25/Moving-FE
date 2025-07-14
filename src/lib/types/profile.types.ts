//기사님 프로필 컴포넌트 모음집
export interface InputFieldProps {
   name: string; //useActionsState로 매핑하기 위한
   text: string;
   placeholder?: string;

   isServiceType?: boolean; //제공 서비스인지
   isArea?: boolean; //서비스 가능 지역인지

   defaultValue?: string | string[];
   onValidChange?: (name: string, value: boolean) => void;
   validator?: (value: string | string[]) => ValidationResult; // 유효성 검사 함수
}

//기사님 프로필 유효성 함수 관련
export type ValidationResult = {
   success: boolean;
   message: string;
};

//기사님 프로필 관련
export type profileState = {
   status: boolean;
   error?: string;
} | null;
