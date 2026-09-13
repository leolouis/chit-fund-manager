export type PaymentMethod =
  | "cash"
  | "upi"
  | "bank"
  | "other";

export interface Payment {
  id?: number;

  chitId: number;
  memberId: number;

  monthNumber: number;

  amountDue: number;
  amountPaid: number;

  paymentDate?: string;

  paymentMethod?: PaymentMethod;

  notes?: string;

  createdAt: string;
}
