import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IVehicleApplication } from "../../../src/domain/models/vehicleApplication/classes/vehicleApplication";
import type { IVehicleApplicationRawObject } from "../../../src/domain/models/vehicleApplication/constant";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../../../src/repositories/vehicleApplicationRepository";
import { seedVehicleApplication } from "../../utils/seedVehicleApplication";

const assertVehicleApplication = (
  vehicleApplcation: IVehicleApplication,
  expectedUserValue: IVehicleApplicationRawObject
) => {
  expect(vehicleApplcation?.id).toBe(expectedUserValue.id);
  expect(vehicleApplcation?.applicantId).toBe(expectedUserValue.applicantId);
  expect(vehicleApplcation?.status.value).toBe(expectedUserValue.status);
  expect(vehicleApplcation?.schoolMember.schoolId).toBe(expectedUserValue.schoolId);
  expect(vehicleApplcation?.driver.licenseId).toBe(expectedUserValue.driverLicenseId);
  expect(vehicleApplcation?.vehicle.licensePlate).toBe(expectedUserValue.licensePlate);
  expect(vehicleApplcation?.stickerNumber).toBe(expectedUserValue.stickerNumber);
  expect(vehicleApplcation?.remarks).toBe(expectedUserValue.remarks);
};

describe("VehicleApplicationRepository.getUserByIds", () => {
  let vehicleApplicationRepository: IVehicleApplicationRepository;

  beforeAll(async () => {
    vehicleApplicationRepository = new VehicleApplicationRepository();
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
  });

  it("should retrieve vehicle application by id", async () => {
    const seededVehicleApplication1 = await seedVehicleApplication({});
    const seededVehicleApplication2 = await seedVehicleApplication({});

    const vehicleApplcation = await vehicleApplicationRepository.getVehicleApplicationByIds([
      seededVehicleApplication1.id,
      seededVehicleApplication2.id
    ]);

    assertVehicleApplication(vehicleApplcation[0], seededVehicleApplication1);
    assertVehicleApplication(vehicleApplcation[1], seededVehicleApplication2);
  });

  it("should retrieve existing vehicle application by id", async () => {
    const seededVehicleApplication1 = await seedVehicleApplication({});
    const seededVehicleApplication2 = await seedVehicleApplication({});
    const seededVehicleApplication3 = "non-existing id";

    const vehicleApplcation = await vehicleApplicationRepository.getVehicleApplicationByIds([
      seededVehicleApplication1.id,
      seededVehicleApplication2.id,
      seededVehicleApplication3
    ]);

    assertVehicleApplication(vehicleApplcation[0], seededVehicleApplication1);
    assertVehicleApplication(vehicleApplcation[1], seededVehicleApplication2);
    expect(vehicleApplcation[2]).toBeUndefined();
    expect(vehicleApplcation.length).toBe(2);
  });

  it("should return empty array when given non-existing id", async () => {
    const vehicleApplcation = await vehicleApplicationRepository.getVehicleApplicationByIds([
      "non-existing id"
    ]);

    expect(vehicleApplcation).toStrictEqual([]);
  });
});
