export interface Auction {
  id?: number;

  chitId: number;

  monthNumber: number;

  auctionDate: string;

  winnerMemberId: number;

  bidAmount: number;

  prizeAmount: number;

  commissionAmount: number;

  dividendAmount: number;

  notes?: string;

  createdAt: string;
}
