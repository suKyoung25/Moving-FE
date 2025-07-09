// type, interface 모음
export type UserType = "guest" | "client" | "mover";

export interface User {
  userType: UserType;
  id: string;
  email: string;
  nickname: string;
  profile?: string;
}

// 유효성 검사용 type 모음
export type AuthValidationResult = {
  success: boolean;
  message?: string;
};
