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
   estimateId: string;
   moverId: string;
   moverName: string;
   moverNickName: string;
   profileImage: string | null;
   comment: string;
   price: number;
   created: string;
   isDesignated: boolean;
   isFavorited: Favorite | null;
   career: number;
   estimateCount: number;
   favoriteCount: number;
   reviewCount: number;
   reviewRating: number;
   isConfirmed: boolean;
}

export interface Quotes {
   requestId: string;
   fromAddress: string;
   toAddress: string;
   moveDate: string;
   moveType: string;
   requestedAt: string;
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
      designatedRequest: {
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
