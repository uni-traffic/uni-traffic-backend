import { NotFoundError, ForbiddenError } from "../../../../shared/core/errors";
import { GetVehicleInformationUseCase } from "../../src/useCases/getVehicleInformationUseCase";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedVehicle } from "../utils/vehicle/seedVehicle";
import { seedAuthenticatedUser } from "../../../user/tests/utils/user/seedAuthenticatedUser"; 

describe("GetVehicleInformationUseCase", () => {
  let getVehicleInformationUseCase: GetVehicleInformationUseCase;

  beforeAll(() => {
    getVehicleInformationUseCase = new GetVehicleInformationUseCase();
  });

  beforeEach(async () => {
    await db.vehicle.deleteMany();
    await db.user.deleteMany();
  });

  it("should return vehicle information when vehicle exists and user has ADMIN role", async () => {
    const seededVehicle = await seedVehicle({});
    const adminUser = await seedAuthenticatedUser({ role: "ADMIN" });

    const result = await getVehicleInformationUseCase.execute(seededVehicle.id, adminUser.id);

    expect(result.id).toBe(seededVehicle.id);
    expect(result.licenseNumber).toBe(seededVehicle.licenseNumber);
    expect(result.stickerNumber).toBe(seededVehicle.stickerNumber);
    expect(result.isActive).toBe(seededVehicle.isActive);
  });

  it("should return vehicle information when vehicle exists and user has SECURITY role", async () => {
    const seededVehicle = await seedVehicle({});
    const securityUser = await seedAuthenticatedUser({ role: "SECURITY" });

    const result = await getVehicleInformationUseCase.execute(seededVehicle.id, securityUser.id);

    expect(result.id).toBe(seededVehicle.id);
  });

  it("should throw NotFoundError when vehicle does not exist", async () => {
    const adminUser = await seedAuthenticatedUser({ role: "ADMIN" });

    await expect(
      getVehicleInformationUseCase.execute("non-existent-id", adminUser.id)
    ).rejects.toThrow(new NotFoundError("Vehicle not found."));
  });

  it("should throw ForbiddenError when user does not have ADMIN or SECURITY role", async () => {
    const seededVehicle = await seedVehicle({});
    const unauthorizedUser = await seedAuthenticatedUser({ role: "STUDENT" });

    await expect(
      getVehicleInformationUseCase.execute(seededVehicle.id, unauthorizedUser.id)
    ).rejects.toThrow(new ForbiddenError("You do not have the required permissions to view this vehicle."));
  });
});
