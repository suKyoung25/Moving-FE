"use client";

import { createContext, useReducer, ReactNode, useRef } from "react";
import { moverReducer } from "./moverReducer";
import { initialState, MoverState } from "@/lib/types/mover.types";
import { useMoverActions } from "./moverActions";

interface MoverContextType {
  state: MoverState;
  loadMovers: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  setFilters: (filters: Partial<MoverState["filters"]>) => void;
  resetFilters: () => void;
  toggleFavorite: (moverId: string, token: string) => Promise<void>;
}

export const MoverContext = createContext<MoverContextType | undefined>(undefined);

export const MoverProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(moverReducer, initialState);
  const pendingFavoriteRequests = useRef<Set<string>>(new Set());
  const actions = useMoverActions(state, dispatch, pendingFavoriteRequests);

  return (
    <MoverContext.Provider value={{ state, ...actions }}>
      {children}
    </MoverContext.Provider>
  );
};
