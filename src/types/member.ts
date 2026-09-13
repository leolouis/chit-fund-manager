export type MemberStatus =
  | "active"
  | "inactive";

export interface Member {
  id?: number;

  chitId: number;

  memberNumber: number;

  name: string;

  phone?: string;

  address?: string;

  joiningDate: string;

  status: MemberStatus;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}
