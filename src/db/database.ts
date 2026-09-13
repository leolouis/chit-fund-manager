import Dexie, { type Table } from "dexie";

import type { Chit } from "../../types/chit";
import type { Member } from "../../types/member";
import type { Payment } from "../../types/payment";
import type { Auction } from "../../types/auction";
import type { Cycle } from "../../types/cycle";

export class ChitFundDatabase extends Dexie {
  chits!: Table<Chit, number>;
  members!: Table<Member, number>;
  payments!: Table<Payment, number>;
  auctions!: Table<Auction, number>;
  cycles!: Table<Cycle, number>;

  constructor() {
    super("ChitFundManager");

    /*
     * Database Version 1
     *
     * Original application database.
     */
    this.version(1).stores({
      chits:
        "++id, name, status, startDate",

      members:
        "++id, chitId, memberNumber, name, phone, status",

      payments:
        "++id, chitId, memberId, monthNumber, paymentDate",

      auctions:
        "++id, chitId, monthNumber, auctionDate, winnerMemberId",
    });

    /*
     * Database Version 2
     *
     * Adds monthly chit cycles and
     * connects payments to cycles.
     */
    this.version(2).stores({
      chits:
        "++id, name, status, startDate",

      members:
        "++id, chitId, memberNumber, name, phone, status",

      payments:
        "++id, chitId, memberId, cycleId, monthNumber, paymentDate",

      auctions:
        "++id, chitId, monthNumber, auctionDate, winnerMemberId",

      cycles:
        "++id, chitId, monthNumber, dueDate, status",
    });
  }
}

export const db =
  new ChitFundDatabase();
