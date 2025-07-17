export interface Favorite {
   id: string;
   clientId: string;
   moverId: string;
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
   isFavorited: Favorite;
   career: number;
   estimateCount: number;
   favoriteCount: number;
   reviewCount: number;
   reviewRating: number;
}

export interface pendingQuote {
   requestId: string;
   fromAddress: string;
   toAddress: string;
   moveDate: string;
   moveType: string;
   estimates: Estimate[];
}
