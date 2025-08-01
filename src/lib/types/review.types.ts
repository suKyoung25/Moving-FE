export interface WritableReview {
   estimateId: string;
   price: number;
   moveType: string;
   moveDate: string;
   isDesignatedEstimate: boolean;
   moverProfileImage: string | null;
   moverNickName: string;
}

export interface MyReview extends WritableReview {
   id: string;
   rating: number;
   content: string;
   createdAt: Date;
}

export interface WritableReviewsResponse {
   data: {
      estimates: WritableReview[];
      pagination: {
         page: number;
         limit: number;
         totalPages: number;
      };
   };
}

export interface MyReviewsResponse {
   data: {
      reviews: MyReview[];
      pagination: {
         page: number;
         limit: number;
         totalPages: number;
      };
   };
}

// TODO: schemas로 이동?
export interface Review {
   id: string;
   rating: number;
   content: string;
   createdAt: string | Date; // TODO: 실제 데이터 받을 시 Date로만
   clientId: string;
   clientName: string;
}

export interface MoverReview {
   id: string;
   rating: number;
   content: string;
   createdAt: Date | string;
   clientName: string;
   price: number;
   moveType: string;
   moveDate: string;
   isDesignatedEstimate: boolean;
}
