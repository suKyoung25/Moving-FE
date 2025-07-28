import { useInfiniteQuery } from "@tanstack/react-query";
import { getReceivedRequests } from "./requests/getAllRequests";
import { ReceivedRequestsProps, ReceivedRequestsResponse } from "@/lib/types";

export const receivedRequestsQueryKey = "receivedRequests";

export function useReceivedRequestsQuery({
   moveType,
   isDesignated,
   keyword,
   sort,
}: ReceivedRequestsProps) {
   return useInfiniteQuery<ReceivedRequestsResponse>({
      queryKey: [
         receivedRequestsQueryKey,
         { moveType, isDesignated, keyword, sort },
      ],
      queryFn: ({ pageParam }) =>
         getReceivedRequests({
            moveType: moveType.join(","),
            isDesignated: isDesignated.toString(),
            keyword,
            sort,
            cursor: pageParam as string | undefined,

            limit: 6,
         }),
      initialPageParam: undefined,

      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
   });
}
