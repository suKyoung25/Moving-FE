import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getRejectedEstimates } from "./requests/getRejectedEstimates";
import { getSentEstimates } from "./requests/getSentEstimates";
import { getRequests } from "./requests/getClientRequest";
import { fetchClientPendingQuotes } from "./requests/getClientPendingQuote";
import { fetchClientReceivedQuotes } from "./requests/getClientReceivedQuote";

export function useRejectedEstimates(page: number, targetLang: string) {
   return useQuery({
      queryKey: ["rejectedEstimates", page, targetLang],
      queryFn: () => getRejectedEstimates(page, targetLang),
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
   });
}

export function useSentEstimates(page: number, targetLang: string) {
   return useQuery({
      queryKey: ["sentEstimates", page, targetLang],
      queryFn: () => getSentEstimates(page, targetLang),
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
   });
}

export function usePendingEstimates(page: number, targetLang?: string) {
   const PAGE_SIZE = 6;
   return useQuery({
      queryKey: ["pendingEstimates", page, targetLang],
      queryFn: async () => {
         const res = await fetchClientPendingQuotes(page, targetLang);
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

export function useReceivedEstimates(category: string, targetLang: string) {
   return useInfiniteQuery({
      queryKey: ["receivedEstimates", category, targetLang],
      queryFn: ({ pageParam = 1 }) =>
         fetchClientReceivedQuotes(category, pageParam, targetLang),
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

export function useRequestsQuery(sort: "asc" | "desc", targetLang: string) {
   return useInfiniteQuery({
      queryKey: ["requests", sort, targetLang],
      queryFn: ({ pageParam }) =>
         getRequests({ cursor: pageParam, sort }, targetLang),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   });
}
