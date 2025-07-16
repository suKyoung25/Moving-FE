// ✅ userType
export type UserType = "client" | "mover";

// ✅ 불러올 사용자 정보
interface BaseUser {
   userType: UserType;
   id: string;
   email: string;
   name: string;
   phone?: string;
   profileImage?: string;
   isProfileCompleted: boolean;
}

interface Client extends BaseUser {
   serviceType: string[];
   livingArea: string[];
}

interface Mover extends BaseUser {
   nickName?: string;
   career?: number;
   introduction?: string;
   description?: string;
   serviceType: string[];
   serviceArea: string[];
   favoriteCount: number;
   estimateCount: number;
   reviewCount: number;
}

export type User = Client | Mover;

// ✅ Type Guard 함수
export function isClient(user: User): user is Client {
   return user.userType === "client";
}

export function isMover(user: User): user is Mover {
   return user.userType === "mover";
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
   user?: BaseUser;
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
   user?: BaseUser;
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
