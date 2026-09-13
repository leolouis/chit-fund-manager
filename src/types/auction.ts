export interface Auction {
  id?: number;

  chitId: number;
  cycleId: number;
  memberId: number;

  auctionDate: string;

  bidAmount: number;
  discountAmount: number;
  prizeAmount: number;

  notes: string;

  createdAt: string;
  updatedAt: string;
}
