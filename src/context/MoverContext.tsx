"use client";

import {
   areaMapping,
   favoriteMover,
   getMovers,
   GetMoversParams,
   unfavoriteMover,
} from "@/lib/actions/mover/mover.action";
import { Mover } from "@/lib/types";
import {
   createContext,
   useContext,
   useReducer,
   useEffect,
   ReactNode,
} from "react";

interface MoverState {
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

type MoverAction =
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
        payload: { moverId: string; isFavorite: boolean };
     };

const initialState: MoverState = {
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

const moverReducer = (state: MoverState, action: MoverAction): MoverState => {
   switch (action.type) {
      case "SET_LOADING":
         return { ...state, loading: action.payload };
      case "SET_ERROR":
         return { ...state, error: action.payload };
      case "SET_MOVERS":
         return { ...state, movers: action.payload };
      case "APPEND_MOVERS":
         const existingIds = new Set(state.movers.map((mover) => mover.id));
         const newMovers = action.payload.filter(
            (mover) => !existingIds.has(mover.id),
         );
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
            movers: state.movers.map((mover) =>
               mover.id === action.payload.moverId
                  ? { ...mover, isFavorite: action.payload.isFavorite }
                  : mover,
            ),
         };
      default:
         return state;
   }
};

interface MoverContextType {
   state: MoverState;
   loadMovers: (reset?: boolean) => Promise<void>;
   loadMore: () => Promise<void>;
   setFilters: (filters: Partial<MoverState["filters"]>) => void;
   resetFilters: () => void;
   toggleFavorite: (moverId: string, token: string) => Promise<void>;
}

const MoverContext = createContext<MoverContextType | undefined>(undefined);

export const MoverProvider = ({ children }: { children: ReactNode }) => {
   const [state, dispatch] = useReducer(moverReducer, initialState);

   const loadMovers = async (reset = false) => {
      try {
         dispatch({ type: "SET_LOADING", payload: true });
         dispatch({ type: "SET_ERROR", payload: null });

         if (reset) {
            dispatch({ type: "RESET_MOVERS" });
         }

         let area =
            state.filters.area !== "all" ? state.filters.area : undefined;
         if (area && areaMapping[area]) {
            area = areaMapping[area][0];
         }

         const params: GetMoversParams = {
            page: reset ? 1 : state.currentPage,
            limit: 10,
            search: state.filters.search || undefined,
            area,
            serviceType:
               state.filters.serviceType !== "all"
                  ? state.filters.serviceType
                  : undefined,
            sortBy: state.filters.sortBy,
         };

         const token = localStorage.getItem("token");
         const response = await getMovers(params, token || undefined);

         if (reset) {
            dispatch({ type: "SET_MOVERS", payload: response.movers });
            dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
         } else {
            dispatch({ type: "APPEND_MOVERS", payload: response.movers });
         }

         dispatch({ type: "SET_HAS_MORE", payload: response.hasMore });
      } catch (error) {
         dispatch({
            type: "SET_ERROR",
            payload: "기사님 목록을 불러오는데 실패했습니다.",
         });
         console.error("Error loading movers:", error);
      } finally {
         dispatch({ type: "SET_LOADING", payload: false });
      }
   };

   const loadMore = async () => {
      if (!state.hasMore || state.loading) return;

      try {
         dispatch({ type: "SET_LOADING", payload: true });

         const nextPage = state.currentPage + 1;
         dispatch({ type: "SET_CURRENT_PAGE", payload: nextPage });

         let area =
            state.filters.area !== "all" ? state.filters.area : undefined;
         if (area && areaMapping[area]) {
            area = areaMapping[area][0];
         }

         const params: GetMoversParams = {
            page: nextPage,
            limit: 10,
            search: state.filters.search || undefined,
            area,
            serviceType:
               state.filters.serviceType !== "all"
                  ? state.filters.serviceType
                  : undefined,
            sortBy: state.filters.sortBy,
         };

         const token = localStorage.getItem("token");
         const response = await getMovers(params, token || undefined);

         dispatch({ type: "APPEND_MOVERS", payload: response.movers });
         dispatch({ type: "SET_HAS_MORE", payload: response.hasMore });
      } catch (error) {
         dispatch({
            type: "SET_ERROR",
            payload: "추가 데이터를 불러오는데 실패했습니다.",
         });
         console.error("Error loading more movers:", error);
      } finally {
         dispatch({ type: "SET_LOADING", payload: false });
      }
   };

   const setFilters = (filters: Partial<MoverState["filters"]>) => {
      dispatch({ type: "SET_FILTERS", payload: filters });
   };

   const resetFilters = () => {
      dispatch({ type: "RESET_FILTERS" });
   };

   const toggleFavorite = async (moverId: string, token: string) => {
      const mover = state.movers.find((m) => m.id === moverId);
      if (!mover) return;

      const originalFavoriteState = mover.isFavorite ?? false;
      const newFavoriteState = !originalFavoriteState;

      try {
         dispatch({
            type: "UPDATE_MOVER_FAVORITE",
            payload: { moverId, isFavorite: newFavoriteState },
         });

         if (newFavoriteState) {
            await favoriteMover(moverId, token);
         } else {
            await unfavoriteMover(moverId, token);
         }
      } catch (error) {
         dispatch({
            type: "UPDATE_MOVER_FAVORITE",
            payload: { moverId, isFavorite: originalFavoriteState },
         });
         console.error("Error toggling favorite:", error);
      }
   };

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         loadMovers(true);
      }, 300);

      return () => clearTimeout(timeoutId);
   }, [
      state.filters.search,
      state.filters.area,
      state.filters.serviceType,
      state.filters.sortBy,
   ]);

   return (
      <MoverContext.Provider
         value={{
            state,
            loadMovers,
            loadMore,
            setFilters,
            resetFilters,
            toggleFavorite,
         }}
      >
         {children}
      </MoverContext.Provider>
   );
};

export const useMover = () => {
   const context = useContext(MoverContext);
   if (!context) {
      throw new Error("useMover must be used within a MoverProvider");
   }
   return context;
};
