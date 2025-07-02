export type UserType = "guest" | "client" | "mover";

export interface User {
  id: string;
  email: string;
  nickname: string;
}
