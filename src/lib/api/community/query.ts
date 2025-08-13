import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCommunityAll from "./getCommunityAll";
import { postReply } from "./postReply";
import { PostReplyError, PostReplyResponse } from "@/lib/types/community.types";
import getReplies from "./getReplies";
import { deleteReply } from "./deleteReply";

export function useGetAllCommunity(offset: number, search?: string) {
   return useQuery({
      queryKey: ["AllCommunity", offset, search],
      queryFn: () => getCommunityAll(offset, search),
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

export function useGetReplies(communityId: string) {
   return useQuery({
      queryKey: ["communityReplies", communityId],
      queryFn: () => getReplies(communityId),
      refetchOnWindowFocus: false,
      placeholderData: (prev) => prev,
   });
}

export function useDeleteReply() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteReply,
      onSuccess: (data, replyId) => {
         // 댓글 목록 쿼리 무효화하여 다시 가져오기
         queryClient.invalidateQueries({
            queryKey: ["communityReplies"],
         });

         // 커뮤니티 상세 데이터도 무효화 (댓글 수 업데이트)
         queryClient.invalidateQueries({
            queryKey: ["community"],
         });
      },
   });
}
