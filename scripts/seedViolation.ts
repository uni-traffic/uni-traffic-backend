import { readFileSync } from "node:fs";
import path from "node:path";
import { db } from "../src/shared/infrastructure/database/prisma";

interface IViolationJSON {
  id: number;
  category: string;
  violationName: string;
  penalty: number;
}

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
    const violations: IViolation[] = (JSON.parse(rawJSONViolationData) as IViolationJSON[]).map(
      (violation) => {
        return {
          ...violation,
          id: String(violation.id)
        };
      }
    );

    await db.violation.createMany({
      data: violations,
      skipDuplicates: true
    });

    if (process.env.NODE_ENV !== "test") console.log("CSV data seeded successfully!");
  } catch (error) {
    console.error("Error reading or inserting CSV data:", error);
  }
};
