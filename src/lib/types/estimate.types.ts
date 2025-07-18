// src/types/estimate.ts
export interface Clients {
   name: string | null;
}

export interface DesignatedRequest {
   moverId: string;
}

export interface EstimateRequest {
   moveDate: string;
   fromAddress: string;
   toAddress: string;
   moveType: string | null;
   requestedAt?: string;
   client: Clients;
   designatedRequest: DesignatedRequest[];
}

export interface Estimate {
   id: string;
   price: number;
   comment?: string;
   createdAt?: string;
   isClientConfirmed?: boolean;
   moverId: string;
   request: EstimateRequest;
}
