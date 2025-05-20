import { faker } from "@faker-js/faker";
import { seedViolationRecord } from "../src/modules/violationRecord/tests/utils/violationRecord/seedViolationRecord";

(async () => {
  const violationIds = [
    "UTP250419E544A9AFCE0C",
    "UTP2504198FF82ACDF876",
    "UTP250419E0A974776B6F",
    "UTP25041942429D7E82F8",
    "UTP2504198EA20315C160",
    "UTP250419B1918DB83CAD"
  ];

  // 7 Days
  const dates = await Promise.all(
    Array.from({ length: 3 }).map(async () => {
      return await Promise.all([
        seedViolationRecord({
          createdAt: faker.date.recent({ days: 180 }),
          violationId: faker.helpers.arrayElement(violationIds)
        }),
        seedViolationRecord({
          createdAt: faker.date.recent({ days: 180 }),
          violationId: faker.helpers.arrayElement(violationIds)
        })
      ]);
    })
  );

  console.log(dates);
})();
