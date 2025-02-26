import { readFileSync } from "node:fs";
import { db } from "../src/shared/infrastructure/database/prisma";
import path from "node:path";

interface IViolation {
  id: string;
  category: string;
  violationName: string;
  penalty: number;
}

export const seedViolations = async () => {
  try {
    await db.violation.deleteMany();
  } catch (error) {
    console.log(error);
  }

  try {
    const relativePath = path.resolve(__dirname, "../data/violationCategory.json");
    const rawJSONViolationData = readFileSync(relativePath, "utf-8");
    const violations: IViolation[] = JSON.parse(rawJSONViolationData).map((violation) => {
      return {
        ...violation,
        id: String(violation.id)
      };
    });

    await db.violation.createMany({
      data: violations,
      skipDuplicates: true
    });

    console.log("CSV data seeded successfully!");
  } catch (error) {
    console.error("Error reading or inserting CSV data:", error);
  }
};
