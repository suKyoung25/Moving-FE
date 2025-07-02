import { UserType } from "@/types/auth.type";

// ✅ 카테고리 정의
const useHeader = (userType: UserType) => {
  switch (userType) {
    case "guest":
      return [{ label: "기사님 찾기", path: "/mover-search" }];
    case "client":
      return [
        { label: "견적 요청", path: "/mover-search" },
        { label: "기사님 찾기", path: "/mover-search" },
        { label: "내 견적 관리", path: "/mover-search" },
      ];
    case "mover":
      return [
        { label: "받은 요청", path: "/mover-search" },
        { label: "내 견적 관리", path: "/mover-search" },
      ];
    default:
      return [];
  }
};

export default useHeader;
