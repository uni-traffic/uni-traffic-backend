import { db } from "../../../../../shared/infrastructure/database/prisma";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../../../src/repositories/vehicleApplicationRepository";
import { seedVehicleApplication } from "../../utils/seedVehicleApplication";

describe("VehicleApplicationRepository.getUserById", () => {
  let vehicleApplicationRepository: IVehicleApplicationRepository;

  beforeAll(async () => {
    vehicleApplicationRepository = new VehicleApplicationRepository();
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
  });

  it("should retrieve existing vehicle application by id", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});

    const vehicle = await vehicleApplicationRepository.getVehicleApplicationById(
      seededVehicleApplication.id
    );

    expect(vehicle).not.toBeNull();
    expect(vehicle?.id).toBe(seededVehicleApplication.id);
    expect(vehicle?.applicantId).toBe(seededVehicleApplication.applicantId);
    expect(vehicle?.status.value).toBe(seededVehicleApplication.status);
    expect(vehicle?.schoolMember.schoolId).toBe(seededVehicleApplication.schoolId);
    expect(vehicle?.driver.licenseId).toBe(seededVehicleApplication.driverLicenseId);
    expect(vehicle?.vehicle.licensePlate).toBe(seededVehicleApplication.licensePlate);
    expect(vehicle?.stickerNumber).toBe(seededVehicleApplication.stickerNumber);
    expect(vehicle?.remarks).toBe(seededVehicleApplication.remarks);
  });

  it("should return null when given a non-existing vehicle application id", async () => {
    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplicationById(
      "non-exisitng vehicle application id"
    );

    expect(vehicleApplication).toBeNull();
  });
});
