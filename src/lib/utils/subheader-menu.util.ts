interface SubMenu {
  label: string;
  path: string;
}

// ✅ 하위 메뉴
const subMenu: Record<string, SubMenu[]> = {
  "client#/my-quotes": [
    { label: "대기 중인 견적", path: "/my-quotes" },
    { label: "받았던 견적", path: "/my-quotes" },
  ],
  "client#/reviews": [
    { label: "작성 가능한 리뷰", path: "/reviews/1" },
    { label: "내가 작성한 리뷰", path: "/reviews" },
  ],
  "mover#/my-quotes": [
    { label: "보낸 견적 조회", path: "/my-quotes" },
    { label: "반려 요청", path: "/my-quotes" },
  ],
};

export default subMenu;
