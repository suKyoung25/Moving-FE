import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getRejectedEstimates } from "./requests/getRejectedEstimates";
import { getSentEstimates } from "./requests/getSentEstimates";
import { fetchClientPendingQuotes } from "./getClientPendingQuote";
import { fetchClientReceivedQuotes } from "./getClientReceivedQuote";

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

export function usePendingEstimates(page: number) {
   const PAGE_SIZE = 6;
   return useQuery({
      queryKey: ["pendingEstimates", page],
      queryFn: async () => {
         const res = await fetchClientPendingQuotes(page);
         const totalCount = res.totalCount;
         const totalPages = Math.ceil(totalCount / PAGE_SIZE);

         return {
            data: res.data,
            totalPages,
         };
      },
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
   });
}

export function useReceivedEstimates(category: string) {
   return useInfiniteQuery({
      queryKey: ["receivedEstimates", category],
      queryFn: ({ pageParam = 1 }) =>
         fetchClientReceivedQuotes(category, pageParam),
      getNextPageParam: (lastPage, allPages) => {
         const loadedCount = allPages.flatMap((page) => page.data).length;
         if (loadedCount < lastPage.totalCount) {
            return allPages.length + 1;
         }
         return undefined;
      },
      initialPageParam: 1,
   });
}
