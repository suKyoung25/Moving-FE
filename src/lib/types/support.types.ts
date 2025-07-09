import { z } from 'zod'
export interface SupportInputProps {
  name: string;
  label: string;
  important: boolean;
  textarea?: boolean;
  fileupload?: boolean;
  validate?: (value: string) => z.SafeParseReturnType<string, string>;
  fileValidate?: (value: File) => z.SafeParseReturnType<File, File>;
  setValidationState : (name : string, isValid : boolean) => void;
}