import { useInfiniteQuery } from "@tanstack/react-query";
import { getReceivedRequests } from "./requests/getAllRequests";
import { ReceivedRequestsProps } from "@/lib/types";

export const receivedRequestsQueryKey = "receivedRequests";

export function useReceivedRequestsQuery({
   moveType,
   isDesignated,
   keyword,
   sort,
}: ReceivedRequestsProps) {
   return useInfiniteQuery({
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
            cursor: pageParam,
            limit: 6,
         }),
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
   });
}
