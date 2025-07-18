import { Mover } from "@/lib/types";

// 환경변수 확인을 위한 로그 (개발 시에만)
console.log("API_BASE URL:", process.env.NEXT_PUBLIC_API_URL);

const API_BASE =
   `${process.env.NEXT_PUBLIC_API_URL}/movers` ||
   "http://localhost:4000/movers";

export interface GetMoversParams {
   page?: number;
   limit?: number;
   search?: string;
   area?: string;
   serviceType?: string;
   sortBy?: string;
}

export interface GetMoversResponse {
   movers: Mover[];
   hasMore: boolean;
   total: number;
   page: number;
   limit: number;
}

// 지역 매핑
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

// 임시 데이터 (개발용) - 더 많은 데이터 추가
const MOCK_MOVERS: Mover[] = [
   {
      id: "1",
      nickName: "김기사",
      favoriteCount: 136,
      averageReviewRating: 4.8,
      reviewCount: 178,
      career: 7,
      estimateCount: 334,
      serviceType: ["SMALL", "HOME"],
      serviceArea: ["서울", "경기"],
      description: "안전하고 신속한 이사 서비스를 제공합니다.",
      isFavorite: false,
   },
   {
      id: "2",
      nickName: "박기사",
      favoriteCount: 89,
      averageReviewRating: 4.6,
      reviewCount: 123,
      career: 5,
      estimateCount: 267,
      serviceType: ["HOME", "OFFICE"],
      serviceArea: ["서울", "인천"],
      description: "정확하고 깔끔한 포장 이사 전문입니다.",
      isFavorite: true,
   },
   {
      id: "3",
      nickName: "이기사",
      favoriteCount: 201,
      averageReviewRating: 4.9,
      reviewCount: 245,
      career: 10,
      estimateCount: 445,
      serviceType: ["SMALL", "HOME", "OFFICE"],
      serviceArea: ["서울", "경기", "인천"],
      description: "20년 경력의 베테랑 기사입니다.",
      isFavorite: false,
   },
   {
      id: "4",
      nickName: "최기사",
      favoriteCount: 67,
      averageReviewRating: 4.7,
      reviewCount: 89,
      career: 6,
      estimateCount: 189,
      serviceType: ["SMALL"],
      serviceArea: ["부산", "경남"],
      description: "소형이사 전문으로 빠르고 정확합니다.",
      isFavorite: false,
   },
   {
      id: "5",
      nickName: "정기사",
      favoriteCount: 154,
      averageReviewRating: 4.5,
      reviewCount: 201,
      career: 8,
      estimateCount: 298,
      serviceType: ["OFFICE"],
      serviceArea: ["대전", "충남"],
      description: "사무실 이전 전문가입니다.",
      isFavorite: true,
   },
   {
      id: "6",
      nickName: "강기사",
      favoriteCount: 112,
      averageReviewRating: 4.9,
      reviewCount: 156,
      career: 12,
      estimateCount: 378,
      serviceType: ["HOME", "OFFICE"],
      serviceArea: ["대구", "경북"],
      description: "고객 만족도 1위 이사 서비스입니다.",
      isFavorite: false,
   },
   {
      id: "7",
      nickName: "조기사",
      favoriteCount: 92,
      averageReviewRating: 4.7,
      reviewCount: 134,
      career: 9,
      estimateCount: 256,
      serviceType: ["SMALL", "HOME"],
      serviceArea: ["광주", "전남"],
      description: "친절하고 꼼꼼한 이사 서비스입니다.",
      isFavorite: false,
   },
   {
      id: "8",
      nickName: "윤기사",
      favoriteCount: 178,
      averageReviewRating: 4.8,
      reviewCount: 212,
      career: 11,
      estimateCount: 389,
      serviceType: ["HOME", "OFFICE"],
      serviceArea: ["울산", "경남"],
      description: "대형 이사 전문 업체입니다.",
      isFavorite: false,
   },
   {
      id: "9",
      nickName: "장기사",
      favoriteCount: 145,
      averageReviewRating: 4.6,
      reviewCount: 167,
      career: 7,
      estimateCount: 278,
      serviceType: ["SMALL"],
      serviceArea: ["세종", "충남"],
      description: "빠르고 안전한 소형이사 전문입니다.",
      isFavorite: false,
   },
   {
      id: "10",
      nickName: "임기사",
      favoriteCount: 123,
      averageReviewRating: 4.9,
      reviewCount: 189,
      career: 13,
      estimateCount: 412,
      serviceType: ["HOME", "OFFICE"],
      serviceArea: ["강원"],
      description: "강원도 전지역 이사 가능합니다.",
      isFavorite: true,
   },
];

// 필터링 및 정렬 함수
const filterAndSortMovers = (
   movers: Mover[],
   params: GetMoversParams,
): Mover[] => {
   let filtered = [...movers];

   console.log("필터링 전 movers 수:", filtered.length);
   console.log("필터 파라미터:", params);

   // 검색어 필터링
   if (params.search) {
      filtered = filtered.filter((mover) =>
         mover.nickName.toLowerCase().includes(params.search!.toLowerCase()),
      );
      console.log("검색어 필터링 후:", filtered.length);
   }

   // 지역 필터링
   if (params.area && params.area !== "all") {
      const targetRegions = areaMapping[params.area] || [];
      console.log("타겟 지역:", targetRegions);
      filtered = filtered.filter((mover) => {
         const hasRegion = mover.serviceArea!.some((serviceArea) =>
            targetRegions.includes(serviceArea),
         );
         console.log(
            `${mover.nickName} - regions: ${mover.serviceArea!.join(", ")} - match: ${hasRegion}`,
         );
         return hasRegion;
      });
      console.log("지역 필터링 후:", filtered.length);
   }

   // 서비스 타입 필터링
   if (params.serviceType && params.serviceType !== "all") {
      filtered = filtered.filter((mover) =>
         mover.serviceType!.includes(params.serviceType as string),
      );
      console.log("서비스 타입 필터링 후:", filtered.length);
   }

   // 정렬
   console.log("정렬 기준:", params.sortBy);
   switch (params.sortBy) {
      case "mostReviewed":
         filtered.sort((a, b) => b.reviewCount - a.reviewCount);
         break;
      case "highRating":
         filtered.sort((a, b) => b.averageReviewRating - a.averageReviewRating);
         break;
      case "highExperience":
         filtered.sort((a, b) => b.career - a.career);
         break;
      case "mostBooked":
         filtered.sort((a, b) => b.estimateCount - a.estimateCount);
         break;
      default:
         // 기본 정렬 (리뷰 많은순)
         filtered.sort((a, b) => b.reviewCount - a.reviewCount);
   }

   console.log("최종 필터링 결과:", filtered.length);
   return filtered;
};

export const getMovers = async (
   params: GetMoversParams = {},
   token?: string,
): Promise<GetMoversResponse> => {
   try {
      const {
         page = 1,
         limit = 10,
         search,
         area,
         serviceType,
         sortBy,
      } = params;

      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      if (search) queryParams.append("search", search);
      if (area && area !== "all") queryParams.append("area", area);
      if (serviceType && serviceType !== "all")
         queryParams.append("serviceType", serviceType);
      if (sortBy) queryParams.append("sortBy", sortBy);

      console.log("API 요청 URL:", `${API_BASE}?${queryParams.toString()}`);

      const res = await fetch(`${API_BASE}?${queryParams.toString()}`, {
         headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // 백엔드 응답 타입 정의
      interface BackendMover {
         id: string;
         nickName: string;
         serviceType: string[];
         career: number;
         averageReviewRating: number;
         reviewCount: number;
         estimateCount: number;
         profileImage?: string;
         isFavorite?: boolean;
         description?: string;
      }

      interface BackendResponse {
         movers?: BackendMover[];
         total?: number;
         page?: number;
         limit?: number;
         hasMore?: boolean;
      }

      const data = (await res.json()) as BackendResponse;

      // 기사님 ID를 기반으로 일관된 랜덤 데이터 생성
      const generateConsistentData = (moverId: string) => {
         // ID를 숫자로 변환해서 시드로 사용
         const seed = moverId
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);

         const seededRandom = (min: number, max: number) => {
            const x = Math.sin(seed) * 10000;
            const random = x - Math.floor(x);
            return Math.floor(random * (max - min + 1)) + min;
         };

         const favoriteCount = seededRandom(50, 250);
         const career = seededRandom(1, 15);
         const reviewCount = seededRandom(20, 300);
         const estimateCount = seededRandom(50, 500);
         const rating = seededRandom(40, 50) / 10; // 4.0 - 5.0

         const regions = [
            ["서울", "경기"],
            ["부산", "경남"],
            ["대구", "경북"],
            ["대전", "충남"],
            ["광주", "전남"],
            ["인천", "경기"],
            ["울산", "경남"],
            ["세종", "충남"],
         ];

         return {
            favoriteCount,
            career,
            reviewCount,
            estimateCount,
            averageReviewRating: rating,
            region: regions[seed % regions.length],
         };
      };

      // 백엔드에서 페이지네이션 정보가 있다면 사용, 없다면 클라이언트에서 처리
      if (data.movers && data.hasMore !== undefined) {
         return {
            movers: data.movers.map((mover) => {
               const generatedData = generateConsistentData(mover.id);
               return {
                  ...mover,
                  favoriteCount: generatedData.favoriteCount,
                  region: generatedData.region,
                  description:
                     mover.description ||
                     "고객님의 물품을 안전하게 운송해 드립니다.",
                  career: mover.career || generatedData.career,
                  averageReviewRating:
                     mover.averageReviewRating ||
                     generatedData.averageReviewRating,
                  reviewCount: mover.reviewCount || generatedData.reviewCount,
                  estimateCount:
                     mover.estimateCount || generatedData.estimateCount,
               };
            }) as Mover[],
            hasMore: data.hasMore,
            total: data.total || 0,
            page: data.page || page,
            limit: data.limit || limit,
         };
      }

      // 기존 방식 (페이지네이션 정보가 없는 경우)
      const movers = (data.movers || data || []) as BackendMover[];
      const hasMore = movers.length === limit;

      return {
         movers:
            movers &&
            (movers?.map((mover) => {
               const generatedData = generateConsistentData(mover.id);
               return {
                  ...mover,
                  favoriteCount: generatedData.favoriteCount,
                  region: generatedData.region,
                  description:
                     mover.description ||
                     "고객님의 물품을 안전하게 운송해 드립니다.",
                  career: mover.career || generatedData.career,
                  averageReviewRating:
                     mover.averageReviewRating ||
                     generatedData.averageReviewRating,
                  reviewCount: mover.reviewCount || generatedData.reviewCount,
                  estimateCount:
                     mover.estimateCount || generatedData.estimateCount,
               };
            }) as Mover[]),
         hasMore,
         total: movers.length,
         page,
         limit,
      };
   } catch (error) {
      console.error("API 요청 실패, 임시 데이터 사용:", error);

      // 개발 환경에서 임시 데이터 사용
      const { page = 1, limit = 10 } = params;

      // 무한 스크롤을 위해 더미 데이터를 확장 (같은 데이터를 반복하되 ID만 변경)
      const expandedMovers: Mover[] = [];
      for (let i = 0; i < 3; i++) {
         // 3번 반복하여 30개의 데이터 생성
         MOCK_MOVERS.forEach((mover) => {
            expandedMovers.push({
               ...mover,
               id: `${mover.id}-copy${i}`, // 고유 ID 생성
            });
         });
      }

      // 필터링 및 정렬 적용
      const filteredMovers = filterAndSortMovers(expandedMovers, params);

      // 페이지네이션
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedMovers = filteredMovers.slice(start, end);

      return {
         movers: paginatedMovers,
         hasMore: end < filteredMovers.length,
         total: filteredMovers.length,
         page,
         limit,
      };
   }
};

export const getMoverById = async (
   id: string,
   token?: string,
): Promise<Mover> => {
   const res = await fetch(`${API_BASE}/${id}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
   });

   if (!res.ok) throw new Error("기사 상세 조회 실패");

   return res.json();
};

export const favoriteMover = async (moverId: string, token: string) => {
   const res = await fetch(`${API_BASE}/${moverId}/favorite`, {
      method: "POST",
      headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
   });

   if (!res.ok) throw new Error("기사 찜하기 실패");

   return res.json();
};

export const unfavoriteMover = async (moverId: string, token: string) => {
   const res = await fetch(`${API_BASE}/${moverId}/favorite`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
   });

   if (!res.ok) throw new Error("기사 찜 해제 실패");
   return res.json();
};
