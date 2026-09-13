export interface Payment {
  id?: number;

  chitId: number;

  memberId: number;

  cycleId?: number;

  monthNumber: number;

  amountDue: number;

  amountPaid: number;

  paymentDate: string;

  paymentMethod: string;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}
