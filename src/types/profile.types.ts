//기사님 프로필 등록 페이지의 input값 모음집
export interface InputFieldProps {
  name?: string;
  text: string; //input의 제목
  placeholder?: string;
  height?: string; //반응형 높이 조절

  isServiceType?: boolean; //제공 서비스인지
  isArea?: boolean; //서비스 가능 지역인지

  defaultValue?: string | string[];
  onValidChange?: (name: string, value: boolean) => void;
  validator?: (value: string | string[]) => ValidationResult; // 유효성 검사 함수
}

export type ValidationResult = {
  success: boolean;
  message: string;
};

export type profileState = {
  status: boolean;
  error?: string;
} | null;
