export interface Cycle {
  id?: number;

  chitId: number;

  monthNumber: number;

  dueDate: string;

  status: "upcoming" | "open" | "completed";

  createdAt: string;
  updatedAt: string;
}
