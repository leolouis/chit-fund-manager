import Dexie, { type Table } from "dexie";

import type { Chit } from "../types/chit";
import type { Member } from "../types/member";
import type { Cycle } from "../types/cycle";
import type { Payment } from "../types/payment";
import type { Auction } from "../types/auction";

export class ChitFundDatabase extends Dexie {
  chits!: Table<Chit, number>;
  members!: Table<Member, number>;
  cycles!: Table<Cycle, number>;
  payments!: Table<Payment, number>;
  auctions!: Table<Auction, number>;

  constructor() {
    super("ChitFundManager");

    this.version(1).stores({
      chits:
        "++id, name, status, startDate",

      members:
        "++id, chitId, memberNumber, name, phone, status",

      cycles:
        "++id, chitId, monthNumber, dueDate, status",

      payments:
        "++id, chitId, cycleId, memberId, monthNumber, paymentDate",

      auctions:
        "++id, chitId, monthNumber, auctionDate, winnerMemberId",
    });
  }
}

export const db = new ChitFundDatabase();
