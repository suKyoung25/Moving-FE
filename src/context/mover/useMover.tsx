// useMover.ts
import { useContext } from "react";
import { MoverContext } from "./MoverContext";

export const useMover = () => {
  const context = useContext(MoverContext);
  if (!context) throw new Error("useMover는 MoverProvider 내부에서 사용되어야 합니다.");
  return context;
};
