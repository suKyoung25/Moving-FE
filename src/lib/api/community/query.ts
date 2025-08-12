import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCommunityAll from "./getCommunityAll";
import { postReply } from "./postReply";
import { PostReplyError, PostReplyResponse } from "@/lib/types/community.types";
import getReplies from "./getReplies";

export function useGetAllCommunity(offset: number) {
   return useQuery({
      queryKey: ["AllCommunity", offset],
      queryFn: () => getCommunityAll(offset),
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
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

export function useGetReplies(communityId: string) {
   return useQuery({
      queryKey: ["communityReplies", communityId],
      queryFn: () => getReplies(communityId),
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
   });
}
