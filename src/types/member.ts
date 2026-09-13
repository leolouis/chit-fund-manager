export interface Member {
  id?: number;

  chitId: number;

  memberNumber: string;

  name: string;

  phone: string;

  address: string;

  joiningDate: string;

  status: "active" | "inactive";

  notes: string;
}
