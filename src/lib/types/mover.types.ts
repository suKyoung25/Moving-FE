import React from "react";

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

export type ValidationResult = {
   success: boolean;
   message: string;
};

export type profileState = {
   status: boolean;
   error?: string;
} | null;

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
