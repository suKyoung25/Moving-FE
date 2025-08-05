import { useQuery } from "@tanstack/react-query";
import { getClientActiveRequest } from "../../estimate/requests/getClientRequest";
import { getRequestDraft } from "./requestDraftApi";

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
   });
};
