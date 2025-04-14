import { faker } from "@faker-js/faker";
import { BadRequest, ForbiddenError, NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import {
  type IUserRepository,
  UserRepository
} from "../../../user/src/repositories/userRepository";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import {
  type IVehicleRepository,
  VehicleRepository
} from "../../../vehicle/src/repositories/vehicleRepository";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../../src/repositories/vehicleApplicationRepository";
import { AssignStickerAndApproveVehicleApplicationUseCase } from "../../src/useCases/assignStickerAndApproveVehicleApplicationUseCase";
import { seedVehicleApplication } from "../utils/seedVehicleApplication";

describe("AssignStickerAndApproveVehicleApplicationUseCase", () => {
  let updateVehicleApplicationStickerUseCase: AssignStickerAndApproveVehicleApplicationUseCase;
  let vehicleApplicationRepository: IVehicleApplicationRepository;
  let vehicleRepository: IVehicleRepository;
  let userRepository: IUserRepository;

  beforeAll(async () => {
    vehicleApplicationRepository = new VehicleApplicationRepository();
    updateVehicleApplicationStickerUseCase = new AssignStickerAndApproveVehicleApplicationUseCase();
    vehicleRepository = new VehicleRepository();
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should successfully update the sticker number and status to APPROVED", async () => {
    const seededAuthenticatedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });
    const stickerNumber = `${new Date().getFullYear()}${faker.number.int({ min: 1000, max: 9999 })}`;

    const updatedVehicleApplication = await updateVehicleApplicationStickerUseCase.execute({
      vehicleApplicationId: seededVehicleApplication.id,
      stickerNumber,
      actorId: seededAuthenticatedUser.id
    });

    const userFromDatabase = await userRepository.getUserById(seededVehicleApplication.applicantId);

    expect(userFromDatabase).not.toBeNull();
    expect(userFromDatabase!.role.value).toBe(seededVehicleApplication.userType);

    const vehicleFromDatabase = await vehicleRepository.getVehicleByProperty({
      stickerNumber: stickerNumber
    });

    expect(vehicleFromDatabase).not.toBeNull();

    expect(updatedVehicleApplication.stickerNumber).toBe(stickerNumber);
    expect(updatedVehicleApplication.status).toBe("APPROVED");

    const vehicleApplicationFromDatabase =
      await vehicleApplicationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.stickerNumber).toBe(stickerNumber);
    expect(vehicleApplicationFromDatabase?.status.value).toBe("APPROVED");

    const auditLog = await db.auditLog.findMany({
      where: { objectId: updatedVehicleApplication.id }
    });

    expect(auditLog).toHaveLength(1);
    expect(auditLog[0].actionType).toBe("UPDATE");
  });

  it("should throw BadRequest when sticker number is empty", async () => {
    const seededAuthenticatedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    await expect(
      updateVehicleApplicationStickerUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        stickerNumber: "",
        actorId: seededAuthenticatedUser.id
      })
    ).rejects.toThrow(new BadRequest(" is not a valid sticker number"));
  });

  it("should require PENDING_FOR_STICKER status", async () => {
    const seededAuthenticatedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    await expect(
      updateVehicleApplicationStickerUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        stickerNumber: `${new Date().getFullYear()}${faker.number.int({ min: 1000, max: 9999 })}`,
        actorId: seededAuthenticatedUser.id
      })
    ).rejects.toThrow(BadRequest);
  });

  it("should throw NotFoundError when vehicle application id does not exist", async () => {
    const seededAuthenticatedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    await expect(
      updateVehicleApplicationStickerUseCase.execute({
        vehicleApplicationId: faker.string.uuid(),
        stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`,
        actorId: seededAuthenticatedUser.id
      })
    ).rejects.toThrow(new NotFoundError("Vehicle Application Not Found"));
  });

  it("should validate empty vehicle application id before lookup", async () => {
    const seededAuthenticatedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    await expect(
      updateVehicleApplicationStickerUseCase.execute({
        vehicleApplicationId: "",
        stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`,
        actorId: seededAuthenticatedUser.id
      })
    ).rejects.toThrow(new BadRequest("Vehicle Application Not Found"));
  });

  it("should throw ForbiddenError when actor lacks permission", async () => {
    const seededAuthenticatedUser = await seedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF"])
    });

    await expect(
      updateVehicleApplicationStickerUseCase.execute({
        vehicleApplicationId: "",
        stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`,
        actorId: seededAuthenticatedUser.id
      })
    ).rejects.toThrow(new ForbiddenError("You do not have permission to perform this action."));
  });
});
