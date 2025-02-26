import { seedUserAccounts } from "./seedUsers";
import { seedVehicleAndOwnerData } from "./seedVehicle";
import { seedViolations } from "./seedViolation";

(async () => {
    await seedUserAccounts();
    await seedVehicleAndOwnerData();
    await seedViolations();
  })();