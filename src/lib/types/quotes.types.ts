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
   isFavorited: Favorite | null;
}

export interface pendingQuote {
   requestId: string;
   fromAddress: string;
   toAddress: string;
   moveDate: string;
   estimates: Estimate[];
}
