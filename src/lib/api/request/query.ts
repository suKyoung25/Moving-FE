import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getReceivedRequests } from "./requests/getAllRequests";
import { ReceivedRequestsProps, ReceivedRequestsResponse } from "@/lib/types";
import { getClientActiveRequest } from "../estimate/requests/getClientRequest";
import { getRequestDraft } from "./requests/requestDraftApi";

export const receivedRequestsQueryKey = "receivedRequests";

export function useReceivedRequestsQuery(
   { moveType, isDesignated, keyword, sort }: ReceivedRequestsProps,
   targetLang: string,
) {
   const query = useInfiniteQuery<ReceivedRequestsResponse>({
      queryKey: [
         receivedRequestsQueryKey,
         { moveType, isDesignated, keyword, sort },
         targetLang,
      ],
      queryFn: ({ pageParam }) =>
         getReceivedRequests(
            {
               moveType: moveType.join(","),
               isDesignated: isDesignated.toString(),
               keyword,
               sort,
               cursor: pageParam as string | undefined,
               limit: 6,
            },
            targetLang,
         ),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
   });

   const totalCount = query.data?.pages?.[0]?.totalCount ?? 0;

   return {
      ...query,
      totalCount,
   };
}

export const useActiveRequest = () => {
   return useQuery({
      queryKey: ["activeRequest"],
      queryFn: getClientActiveRequest,
      staleTime: 1000 * 60 * 1,
   });
};

export const useRequestDraft = () => {
   return useQuery({
      queryKey: ["requestDraft"],
      queryFn: getRequestDraft,
      staleTime: 0,
   });
};
