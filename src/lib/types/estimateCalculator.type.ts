export interface FormData {
   moveType: "SMALL" | "HOME" | "OFFICE" | "";
   fromAddress: string;
   toAddress: string;
   moveDate: string;
   isWeekend: boolean;
   hasElevator: boolean;
   itemAmount: "few" | "normal" | "many";
   floorLevel: "1-3" | "4-7" | "8+";
}

export interface AIEstimateType {
   price: number;
   explanation: string;
   confidence: number;
   factors: Array<{
      factor: string;
      impact: string;
   }>;
}

export interface MoveTypeOption {
   moveType: "SMALL" | "HOME" | "OFFICE";
   label: string;
   desc: string;
   price: string;
}

export interface PriceBreakdown {
   basePrice: number;
   distanceFee: number;
   weekendSurcharge: number;
   elevatorAdjustment: number;
   itemAdjustment: number;
   floorAdjustment: number;
   total: number;
}

export interface Coordinates {
   lat: number;
   lng: number;
}

export interface AddressSuggestion {
   description: string;
   place_id?: string;
}
