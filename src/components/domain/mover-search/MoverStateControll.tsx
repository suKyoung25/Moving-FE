"use client";

import { createContext, useReducer, ReactNode, useRef, useContext } from "react";
import { initialState, MoverState, MoverAction } from "@/lib/types/mover.types";
import { useMoverApis } from "@/lib/hooks/useMoverApis";

interface MoverContextType {
  state: MoverState;
  loadMovers: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  setFilters: (filters: Partial<MoverState["filters"]>) => void;
  resetFilters: () => void;
  toggleFavorite: (moverId: string) => Promise<void>; // token 매개변수 제거
}

const moverReducer = (state: MoverState, action: MoverAction): MoverState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_MOVERS":
      return { ...state, movers: action.payload };
    case "APPEND_MOVERS":
      const existingIds = new Set(state.movers.map((m) => m.id));
      const newMovers = action.payload.filter((m) => !existingIds.has(m.id));
      return { ...state, movers: [...state.movers, ...newMovers] };
    case "SET_HAS_MORE":
      return { ...state, hasMore: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":
      return {
        ...state,
        filters: {
          search: "",
          area: "all",
          serviceType: "all",
          sortBy: "mostReviewed",
        },
      };
    case "RESET_MOVERS":
      return { ...state, movers: [], currentPage: 1, hasMore: true };
    case "UPDATE_MOVER_FAVORITE":
      return {
        ...state,
        movers: state.movers.map((m) =>
          m.id === action.payload.moverId
            ? {
                ...m,
                isFavorite: action.payload.isFavorite,
                favoriteCount: action.payload.favoriteCount ?? m.favoriteCount,
              }
            : m
        ),
      };
    default:
      return state;
  }
};

export const useMover = () => {
  const context = useContext(MoverContext);
  if (!context) throw new Error("useMover는 MoverProvider 내부에서 사용되어야 합니다.");
  return context;
};


export const MoverContext = createContext<MoverContextType | undefined>(undefined);

export const MoverProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(moverReducer, initialState);
  const pendingFavoriteRequests = useRef<Set<string>>(new Set());
  const actions = useMoverApis(state, dispatch, pendingFavoriteRequests);

  return (
    <MoverContext.Provider value={{ state, ...actions }}>
      {children}
    </MoverContext.Provider>
  );
};