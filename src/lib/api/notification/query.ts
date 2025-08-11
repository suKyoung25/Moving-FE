import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "./notification";

export function useNotificationsQuery(targetLang: string) {
   return useInfiniteQuery({
      queryKey: ["notifications", targetLang],
      queryFn: ({ pageParam }) =>
         getNotifications({ cursor: pageParam }, targetLang),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
   });
}
