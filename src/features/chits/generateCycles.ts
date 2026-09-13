import { db } from "../../db/database";
import type { Cycle } from "../../types/cycle";

export async function generateCycles(
  chitId: number,
) {
  const chit = await db.chits.get(chitId);

  if (!chit) {
    throw new Error("Chit not found.");
  }

  const existingCycles =
    await db.cycles
      .where("chitId")
      .equals(chitId)
      .toArray();

  if (existingCycles.length > 0) {
    return;
  }

  const startDate = new Date(
    `${chit.startDate}T00:00:00`,
  );

  const now = new Date().toISOString();

  const cycles: Cycle[] = [];

  for (
    let month = 1;
    month <= chit.durationMonths;
    month++
  ) {
    const dueDate = new Date(startDate);

    dueDate.setMonth(
      startDate.getMonth() + month - 1,
    );

    const cycleDate =
      dueDate.toISOString().split("T")[0];

    let status: Cycle["status"] =
      "upcoming";

    const today = new Date();

    if (dueDate <= today) {
      status = "open";
    }

    cycles.push({
      chitId,

      monthNumber: month,

      dueDate: cycleDate,

      status,

      createdAt: now,
      updatedAt: now,
    });
  }

  await db.cycles.bulkAdd(cycles);
}
