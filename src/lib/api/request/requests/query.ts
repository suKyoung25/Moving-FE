import { useQuery } from "@tanstack/react-query";
import { getClientActiveRequest } from "../../estimate/requests/getClientRequest";
import { getRequestDraft } from "./requestDraftApi";

export const useActiveRequest = (targetLang: string) => {
   return useQuery({
      queryKey: ["activeRequest", targetLang],
      queryFn: () => getClientActiveRequest(targetLang),
      staleTime: 1000 * 60 * 1,
   });
};

export const useRequestDraft = (targetLang: string) => {
   return useQuery({
      queryKey: ["requestDraft", targetLang],
      queryFn: () => getRequestDraft(targetLang),
   });
};
