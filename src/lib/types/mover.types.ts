export interface Mover {
   id: string;
   name?: string;
   profileImage?: string;
   nickName: string;
   career: number;
   introduction?: string;
   description?: string;
   serviceType?: string[];
   serviceArea?: string[];
   favoriteCount: number;
   estimateCount: number;
   averageReviewRating: number;
   reviewCount: number;
   isFavorite?: boolean;
}

export interface DropdownOption {
   label: string;
   value: string;
}

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


export interface MoverState {
  movers: Mover[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  filters: {
    search: string;
    area: string;
    serviceType: string;
    sortBy: string;
  };
}

export type MoverAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_MOVERS"; payload: Mover[] }
  | { type: "APPEND_MOVERS"; payload: Mover[] }
  | { type: "SET_HAS_MORE"; payload: boolean }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_FILTERS"; payload: Partial<MoverState["filters"]> }
  | { type: "RESET_FILTERS" }
  | { type: "RESET_MOVERS" }
  | {
      type: "UPDATE_MOVER_FAVORITE";
      payload: { moverId: string; isFavorite: boolean; favoriteCount?: number };
    };

export const initialState: MoverState = {
  movers: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  filters: {
    search: "",
    area: "all",
    serviceType: "all",
    sortBy: "mostReviewed",
  },
};
