export interface InputFieldProps {
  name: string;
  text: string; //input의 제목
  placeholder?: string;
  height?: string; //반응형 높이 조절

  isImage?: boolean; //이미지input인지
  isTextArea?: boolean; //textArea인지
  isServiceType?: boolean; //제공 서비스인지
  isArea?: boolean; //서비스 가능 지역인지

  // error?: string;
  // value?: string | string[];
  // onChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  onValidChange?: (name: string, value: boolean) => void;
  validator?: (value: string | string[]) => ValidationResult; // 유효성 검사 함수
}

export type ValidationResult = {
  success: boolean;
  message: string;
};
