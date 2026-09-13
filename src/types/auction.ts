export interface Auction {
  id?: number;

  chitId: number;
  cycleId: number;

  winnerMemberId: number;

  auctionDate: string;

  bidAmount: number;
  discountAmount: number;
  prizeAmount: number;

  status: "completed" | "cancelled";

  notes: string;

  createdAt: string;
  updatedAt: string;
}
