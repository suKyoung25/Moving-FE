// mover.constants.ts

import { DropdownOption } from "@/lib/types/mover.types";

export const AREA_OPTIONS: DropdownOption[] = [
   { label: "전체", value: "all" },
   { label: "서울", value: "seoul" },
   { label: "인천", value: "incheon" },
   { label: "대전", value: "daejeon" },
   { label: "대구", value: "daegu" },
   { label: "광주", value: "gwangju" },
   { label: "부산", value: "busan" },
   { label: "울산", value: "ulsan" },
   { label: "세종", value: "sejong" },
   { label: "경기", value: "gyeonggi" },
   { label: "강원", value: "gangwon" },
   { label: "충북", value: "chungbuk" },
   { label: "충남", value: "chungnam" },
   { label: "전북", value: "jeonbuk" },
   { label: "전남", value: "jeonnam" },
   { label: "경북", value: "gyeongbuk" },
   { label: "경남", value: "gyeongnam" },
   { label: "제주", value: "jeju" },
];

export const SERVICE_OPTIONS: DropdownOption[] = [
   { label: "전체", value: "all" },
   { label: "소형이사", value: "SMALL" },
   { label: "가정이사", value: "HOME" },
   { label: "사무실이사", value: "OFFICE" },
];

export const SORT_OPTIONS: DropdownOption[] = [
   { label: "리뷰 많은순", value: "mostReviewed" },
   { label: "평점 높은순", value: "highRating" },
   { label: "경력 높은순", value: "highExperience" },
   { label: "확정 많은순", value: "mostBooked" },
];


// 지역 코드 → 실제 이름 매핑
export const areaMapping: { [key: string]: string[] } = {
  seoul: ["서울"],
  incheon: ["인천"],
  daejeon: ["대전"],
  daegu: ["대구"],
  gwangju: ["광주"],
  busan: ["부산"],
  ulsan: ["울산"],
  sejong: ["세종"],
  gyeonggi: ["경기"],
  gangwon: ["강원"],
  chungbuk: ["충북"],
  chungnam: ["충남"],
  jeonbuk: ["전북"],
  jeonnam: ["전남"],
  gyeongbuk: ["경북"],
  gyeongnam: ["경남"],
  jeju: ["제주"],
};
