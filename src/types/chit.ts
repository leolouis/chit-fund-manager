export type ChitStatus =
  | "active"
  | "completed"
  | "archived";

export interface Chit {
  id?: number;

  name: string;

  chitAmount: number;
  monthlyAmount: number;

  memberCount: number;
  durationMonths: number;

  startDate: string;
  endDate: string;

  commissionPercentage: number;

  status: ChitStatus;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}
