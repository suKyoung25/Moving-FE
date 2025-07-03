export type UserType = "guest" | "client" | "mover";

export interface User {
  userType: UserType;
  id: string;
  email: string;
  nickname: string;
  profile?: string;
}
