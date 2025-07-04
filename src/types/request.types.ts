export type Request = {
  id: number;
  clientId: string;
  moverId: string;
  moveType: "small" | "home" | "office";
  moveDate: Date;
  fromAddress: string;
  toAddress: string;
  isDesignated: boolean;
  requestStatus: "pending" | "confirmed" | "rejected";
  rejectedReason?: string;
  requestedAt: Date;
};
