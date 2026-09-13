export interface Cycle {
  id?: number;

  chitId: number;

  monthNumber: number;

  dueDate: string;

  status: "open" | "closed";
}
