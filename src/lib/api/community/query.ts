import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCommunityAll from "./requests/getCommunityAll";
import { postReply } from "./requests/postReply";
import getReplies from "./requests/getReplies";
import { deleteReply } from "./requests/deleteReply";
import { PostReplyError, PostReplyResponse } from "@/lib/types";

export function useGetAllCommunity(
   offset: number,
   search?: string,
   locale?: string,
) {
   return useQuery({
      queryKey: ["AllCommunity", offset, search, locale],
      queryFn: () => getCommunityAll(offset, search, locale),
      refetchOnWindowFocus: false,
   });
}

export function usePostReply() {
   const queryClient = useQueryClient();

   return useMutation<
      PostReplyResponse,
      PostReplyError,
      { id: string; content: string }
   >({
      mutationFn: ({ id, content }) => postReply(id, content),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["communityReplies"] });
      },
      onError: (error: PostReplyError) => {
         console.error("댓글 작성 실패:", error.message);
      },
   });
}

export function useGetReplies(communityId: string, locale?: string) {
   return useQuery({
      queryKey: ["communityReplies", communityId, locale],
      queryFn: () => getReplies(communityId, locale),
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
   });
}

export function useDeleteReply() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteReply,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["communityReplies"],
         });

         queryClient.invalidateQueries({
            queryKey: ["community"],
         });
      },
   });
}
