// moverActions.ts
import { Dispatch, useCallback, useEffect } from "react";
import { MoverAction, MoverState } from "@/lib/types/mover.types";
import { getMovers, toggleFavoriteMover, GetMoversParams } from "@/lib/api/mover";
import { areaMapping } from "@/constants/mover.constants";

export const useMoverActions = (
  state: MoverState,
  dispatch: Dispatch<MoverAction>,
  pendingFavoriteRequests: React.MutableRefObject<Set<string>>
) => {
  const loadMovers = useCallback(
    async (reset = false) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        if (reset) {
          dispatch({ type: "RESET_MOVERS" });
        }

        let area = state.filters.area !== "all" ? state.filters.area : undefined;
        if (area && areaMapping[area]) {
          area = areaMapping[area][0];
        }

        const params: GetMoversParams = {
          page: reset ? 1 : state.currentPage,
          limit: 10,
          search: state.filters.search || undefined,
          area,
          serviceType:
            state.filters.serviceType !== "all" ? state.filters.serviceType : undefined,
          sortBy: state.filters.sortBy,
        };

        const token = localStorage.getItem("token") ?? undefined;
        const response = await getMovers(params, token);

        if (reset) {
          dispatch({ type: "SET_MOVERS", payload: response.movers });
          dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
        } else {
          dispatch({ type: "APPEND_MOVERS", payload: response.movers });
        }

        dispatch({ type: "SET_HAS_MORE", payload: response.hasMore });
      } catch {
        dispatch({ type: "SET_ERROR", payload: "기사님 목록을 불러오는데 실패했습니다." });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.filters, state.currentPage]
  );

  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.loading) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const nextPage = state.currentPage + 1;
      let area = state.filters.area !== "all" ? state.filters.area : undefined;
      if (area && areaMapping[area]) {
        area = areaMapping[area][0];
      }

      const params: GetMoversParams = {
        page: nextPage,
        limit: 10,
        search: state.filters.search || undefined,
        area,
        serviceType:
          state.filters.serviceType !== "all" ? state.filters.serviceType : undefined,
        sortBy: state.filters.sortBy,
      };

      const token = localStorage.getItem("token") ?? undefined;
      const response = await getMovers(params, token);

      dispatch({ type: "SET_CURRENT_PAGE", payload: nextPage });
      dispatch({ type: "APPEND_MOVERS", payload: response.movers });
      dispatch({ type: "SET_HAS_MORE", payload: response.hasMore });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "추가 데이터를 불러오는데 실패했습니다." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state]);

  const setFilters = useCallback((filters: Partial<MoverState["filters"]>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const toggleFavorite = useCallback(async (moverId: string, token: string) => {
    if (pendingFavoriteRequests.current.has(moverId)) return;

    const mover = state.movers.find((m) => m.id === moverId);
    if (!mover) return;

    pendingFavoriteRequests.current.add(moverId);

    try {
      const result = await toggleFavoriteMover(moverId, token);
      dispatch({
        type: "UPDATE_MOVER_FAVORITE",
        payload: {
          moverId,
          isFavorite: result.isFavorite,
          favoriteCount: result.favoriteCount,
        },
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "찜 처리 중 오류 발생");
    } finally {
      pendingFavoriteRequests.current.delete(moverId);
    }
  }, [state.movers]);

  // 필터 변경 시 자동 재로딩 (디바운스 적용은 최상단에서 직접 useEffect 사용)
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

  return {
    loadMovers,
    loadMore,
    setFilters,
    resetFilters,
    toggleFavorite,
  };
};
