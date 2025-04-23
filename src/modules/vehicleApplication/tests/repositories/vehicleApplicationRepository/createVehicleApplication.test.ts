import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../../../src/repositories/vehicleApplicationRepository";
import { createVehicleApplicationDomainObject } from "../../utils/createVehicleApplicationDomainObject";

describe("VehicleApplicationRepository.createVehicleApplication", () => {
  let vehicleApplicationRepository: IVehicleApplicationRepository;

  beforeAll(() => {
    vehicleApplicationRepository = new VehicleApplicationRepository();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully save the vehicle application", async () => {
    const seededUser = await seedUser({ role: "GUEST" });
    const vehicleApplicationDomainObject = createVehicleApplicationDomainObject({
      applicantId: seededUser.id
    });

    const savedVehicleApplication = await vehicleApplicationRepository.createVehicleApplication(
      vehicleApplicationDomainObject
    );

    expect(savedVehicleApplication).not.toBeNull();
  });

  it("should fail to save the vehicle application when applicantId doesnt match a user", async () => {
    const vehicleApplicationDomainObject = createVehicleApplicationDomainObject({});

    const savedVehicleApplication = await vehicleApplicationRepository.createVehicleApplication(
      vehicleApplicationDomainObject
    );

    expect(savedVehicleApplication).toBeNull();
  });
});
