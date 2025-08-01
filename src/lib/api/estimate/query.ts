import { useQuery } from "@tanstack/react-query";
import { getRejectedEstimates } from "./requests/getRejectedEstimates";
import { getSentEstimates } from "./requests/getSentEstimates";

export function useRejectedEstimates(page: number) {
   return useQuery({
      queryKey: ["rejectedEstimates", page],
      queryFn: () => getRejectedEstimates(page),
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
   });
}

export function useSentEstimates(page: number) {
   return useQuery({
      queryKey: ["sentEstimates", page],
      queryFn: () => getSentEstimates(page),
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
   });
}
