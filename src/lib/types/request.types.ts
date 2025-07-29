export interface Request {
   id: number;
   clientId: string;
   moverId: string;
   moveType: "SMALL" | "HOME" | "OFFICE";
   moveDate: Date;
   fromAddress: string;
   toAddress: string;
   isDesignated: boolean;
   requestStatus: "pending" | "confirmed" | "rejected";
   rejectedReason?: string;
   requestedAt: Date;
}

export interface CreateRequestDto {
   moveType: "SMALL" | "HOME" | "OFFICE";
   moveDate: Date;
   fromAddress: string;
   toAddress: string;
}

// 각 단계에서 입력받는 데이터 구조
export interface FormWizardState {
   moveType: Request["moveType"] | undefined;
   moveDate: Request["moveDate"] | undefined;
   fromAddress: Request["fromAddress"] | undefined;
   toAddress: Request["toAddress"] | undefined;
}

export interface ReceivedRequestsResponse {
   requests: ReceivedRequest[];
   nextCursor: string | null;
}

// 받은 요청 필터 타입
export interface Params {
   moveType?: string;
   serviceArea?: string;
   isDesignated?: string;
   keyword?: string;
   sort?: "moveDate-asc" | "moveDate-desc";
   limit?: number;
   cursor?: string;
}

// 받은 요청 데이터 타입
export interface ReceivedRequest {
   id: string;
   clientId: string;
   clientName: string;
   fromAddress: string;
   toAddress: string;
   moveType: "SMALL" | "HOME" | "OFFICE";
   moveDate: string; // ISO 문자열 (Date로 변환하려면 별도 처리)
   requestedAt: string;
   isDesignated: boolean;
   isPending: boolean;
}

export interface ReceivedRequestsProps {
   moveType: string[];
   isDesignated: boolean;
   keyword: string;
   sort: "moveDate-asc" | "moveDate-desc";
}
