import { Dispatch, useCallback, useEffect } from "react";
import { MoverAction, MoverState } from "@/lib/types/mover.types";
import { getMovers } from "@/lib/api/mover/getMover";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { GetMoversParams } from "@/lib/types/mover.types";
import { areaMapping } from "@/constants/mover.constants";
import { tokenSettings } from "@/lib/utils/auth.util";

export const useMoverApis = (
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

        // 로그인 여부 확인 (token이 있으면 true, 없으면 false)
        const hasToken = Boolean(tokenSettings.get());
        const response = await getMovers(params, hasToken);

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

      // 로그인 여부 확인 (token이 있으면 true, 없으면 false)
      const hasToken = Boolean(tokenSettings.get());
      const response = await getMovers(params, hasToken);

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

  // tokenFetch를 사용하므로 token 매개변수 제거
  const toggleFavorite = useCallback(async (moverId: string) => {
    if (pendingFavoriteRequests.current.has(moverId)) return;

    const mover = state.movers.find((m) => m.id === moverId);
    if (!mover) return;

    pendingFavoriteRequests.current.add(moverId);

    try {
      const result = await toggleFavoriteMover(moverId);
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

  // 필터 변경 시 자동 재로딩 (디바운스 적용)
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
