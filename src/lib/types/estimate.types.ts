export interface Favorite {
   id: string;
   clientId: string;
   moverId: string;
}

export interface DesignatedRequest {
   id: string;
   createdAt: Date;
   moverId: string;
   requestId: string;
}

export interface Estimate {
   id?: string;
   career: number;
   comment: string;
   created: string;
   estimateCount: number;
   estimateId: string;
   favoriteCount: number;
   isClientConfirmed?: boolean; // TODO: 통합 필요
   isConfirmed: boolean;
   moverId: string;
   moverName: string;
   moverNickName: string;
   price: number;
   reviewCount: number;
   reviewRating: number;
   isFavorited: Favorite | null;
   profileImage: string | null;
   isDesignated: boolean;
}

export type EstimateMoveType = "SMALL" | "MEDIUM" | "LARGE" | string;

export interface EstimateRequest {
   designatedRequest: DesignatedRequest[];
   fromAddress: string;
   moveDate: string;
   moveType: EstimateMoveType;
   requestId: string;
   requestedAt: string;
   toAddress: string;
}

export interface Quotes {
   requestId: string;
   fromAddress: string;
   toAddress: string;
   moveDate: string;
   moveType: string;
   requestedAt: string;
   isPending?: boolean;
   estimates: Estimate[];
   designatedRequest: DesignatedRequest[];
}

export interface MyEstimateDetail {
   id: string;
   price: number;
   comment: string;
   createdAt: string;
   isClientConfirmed: boolean;
   moverId: string;
   request: {
      moveDate: string;
      fromAddress: string;
      toAddress: string;
      moveType: "HOME" | "OFFICE" | "ETC";
      client: {
         name: string;
      };
      designatedRequests: {
         moverId: string;
      }[];
   };
}

export interface SendEstimateParams {
   price: number;
   comment: string;
   clientId: string;
   requestId: string;
}

export interface RejectEstimateParams {
   comment: string;
   clientId: string;
   requestId: string;
}

export interface QuoteItem {
   estimate: Estimate;
   request: EstimateRequest;
}

export interface PendingQuotesResponse {
   message: string;
   data: QuoteItem[];
   totalCount: number;
}

export interface ReceivedEstimateData {
   estimates: Estimate[];
   request: EstimateRequest;
}

interface RequestType {
   requestId: string;
   fromAddress: string;
   moveDate: Date;
   moveType: string;
   toAddress: string;
   requestedAt: Date;
   designatedRequest: DesignatedRequest[];
}

export interface DataItem {
   request: RequestType;
   estimate: Estimate;
}

export interface GroupedByRequest {
   request: RequestType;
   estimates: Estimate[];
}
