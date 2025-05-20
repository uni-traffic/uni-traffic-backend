import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { IVehicleApplication } from "../../../src/domain/models/vehicleApplication/classes/vehicleApplication";
import type { IVehicleApplicationRawObject } from "../../../src/domain/models/vehicleApplication/constant";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../../../src/repositories/vehicleApplicationRepository";
import { seedVehicleApplication } from "../../utils/seedVehicleApplication";

const assertVehicleApplication = (
  vehicleApplication: IVehicleApplication,
  expectedUserValue: IVehicleApplicationRawObject
) => {
  expect(vehicleApplication?.id).toBe(expectedUserValue.id);
  expect(vehicleApplication?.applicantId).toBe(expectedUserValue.applicantId);
  expect(vehicleApplication?.status.value).toBe(expectedUserValue.status);
  expect(vehicleApplication?.schoolMember.schoolId).toBe(expectedUserValue.schoolId);
  expect(vehicleApplication?.driver.licenseId).toBe(expectedUserValue.driverLicenseId);
  expect(vehicleApplication?.vehicle.licensePlate).toBe(expectedUserValue.licensePlate);
  expect(vehicleApplication?.stickerNumber).toBe(expectedUserValue.stickerNumber);
  expect(vehicleApplication?.remarks).toBe(expectedUserValue.remarks);
};

describe("VehicleApplicationRepository.getUserByIds", () => {
  let vehicleApplicationRepository: IVehicleApplicationRepository;

  beforeAll(async () => {
    vehicleApplicationRepository = new VehicleApplicationRepository();
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should retrieve vehicle application by id", async () => {
    const seededVehicleApplication1 = await seedVehicleApplication({});
    const seededVehicleApplication2 = await seedVehicleApplication({});

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplicationByIds([
      seededVehicleApplication1.id,
      seededVehicleApplication2.id
    ]);

    assertVehicleApplication(vehicleApplication[0], seededVehicleApplication1);
    assertVehicleApplication(vehicleApplication[1], seededVehicleApplication2);
  });

  it("should retrieve existing vehicle application by id", async () => {
    const seededVehicleApplication1 = await seedVehicleApplication({});
    const seededVehicleApplication2 = await seedVehicleApplication({});
    const seededVehicleApplication3 = "non-existing id";

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplicationByIds([
      seededVehicleApplication1.id,
      seededVehicleApplication2.id,
      seededVehicleApplication3
    ]);

    assertVehicleApplication(vehicleApplication[0], seededVehicleApplication1);
    assertVehicleApplication(vehicleApplication[1], seededVehicleApplication2);
    expect(vehicleApplication[2]).toBeUndefined();
    expect(vehicleApplication.length).toBe(2);
  });

  it("should return empty array when given non-existing id", async () => {
    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplicationByIds([
      "non-existing id"
    ]);

    expect(vehicleApplication).toStrictEqual([]);
  });
});
