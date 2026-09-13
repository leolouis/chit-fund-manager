export interface Payment {
  id?: number;

  chitId: number;

  cycleId: number;

  memberId: number;

  monthNumber: number;

  amountDue: number;

  amountPaid: number;

  paymentDate: string;

  paymentMethod: string;

  notes: string;

  createdAt: string;

  updatedAt: string;
}
