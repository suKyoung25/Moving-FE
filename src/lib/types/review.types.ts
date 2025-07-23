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

export type ReviewFormState = {
   success: boolean;
   message: string;
};

export type ReviewPayload = {
   estimateId: string;
   rating: number;
   content: string;
};

// TODO: schemas로 이동?
export interface Review {
   id: string;
   rating: number;
   content: string;
   createdAt: string | Date; // TODO: 실제 데이터 받을 시 Date로만
   clientId: string;
   clientName: string;
}
