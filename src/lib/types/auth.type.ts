// userType
export type UserType = "guest" | "client" | "mover";

// 그냥 불러올 User 정보 (헤더)
export interface User {
   userType: UserType;
   id: string;
   email: string;
   name: string;
   profile?: string;
}

// 유효성 검사용 type 모음
export type AuthValidationResult = {
   success: boolean;
   message: string;
};

// 인증 정보
export type AuthValidation = {
   success: boolean;
   error?: string | Record<string, string>;
   user?: User;
   accessToken?: string;
};

// 회원가입 양식
export interface SignUpFormState {
   name: string;
   email: string;
   phone: string;
   password: string;
   passwordConfirmation: string;
}

// 오류 상태
export interface ErrorsState {
   [key: string]: string;
}

// Server Action 응답
export interface AuthActionResult {
   success: boolean;
   user?: User;
   accessToken?: string;
   fieldErrors?: Record<string, string>;
   globalError?: string;
}

export interface FetchError {
   status: number;
   body: {
      message: string;
      [key: string]: unknown;
   };
}
