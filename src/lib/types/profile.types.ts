import { Control, FieldError, Path, UseFormRegister } from "react-hook-form";
import { User } from "./auth.types";

//바로 아래+기사님 프로필 컴포넌트에서 사용
export type FieldValue = string | string[] | undefined;

//기사님 프로필 컴포넌트 모음집
export interface InputFieldProps<T extends Record<string, FieldValue>> {
   name: Path<T>;
   text: string;
   placeholder?: string;

   isServiceType?: boolean; //제공 서비스인지
   isArea?: boolean; //서비스 가능 지역인지
   options?: string[];

   control?: Control<T>;
   register?: UseFormRegister<T>;
   error?: FieldError;
}

//기사님 프로필 유효성 함수 관련
export type ValidationResult = {
   success: boolean;
   message: string;
};

//기사님 프로필 관련
export type profileState = {
   success: boolean;
   user?: User;
   error?: string;
   accessToken?: string;
   fieldErrors?: Record<string, string>;
   globalError?: string;
   message?: string;
};
