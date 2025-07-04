export interface InputFieldProps {
  name?: string;
  isImage?: boolean; //이미지input인지
  isTextArea?: boolean; //textArea인지
  isServiceType?: boolean; //제공 서비스인지
  isArea?: boolean; //서비스 가능 지역인지
  text: string;
  placeholder?: string;
  height?: string;
  error?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}
