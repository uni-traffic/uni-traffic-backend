import { faker } from "@faker-js/faker";
import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
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
import { UpdateVehicleApplicationStickerUseCase } from "../../src/useCases/updateVehicleApplicationStickerUseCase";
import { seedVehicleApplication } from "../utils/seedVehicleApplication";

describe("UpdateVehicleApplicationStickerUseCase", () => {
  let updateVehicleApplicationStickerUseCase: UpdateVehicleApplicationStickerUseCase;
  let vehicleApplicationRepository: IVehicleApplicationRepository;
  let vehicleRepository: IVehicleRepository;
  let userRepository: IUserRepository;

  beforeAll(async () => {
    vehicleApplicationRepository = new VehicleApplicationRepository();
    updateVehicleApplicationStickerUseCase = new UpdateVehicleApplicationStickerUseCase();
    vehicleRepository = new VehicleRepository();
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should successfully update the sticker number and status to APPROVED", async () => {
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });
    const stickerNumber = `${new Date().getFullYear()}${faker.number.int({ min: 1000, max: 9999 })}`;

    const updatedVehicleApplication = await updateVehicleApplicationStickerUseCase.execute(
      {
        vehicleApplicationId: seededVehicleApplication.id,
        stickerNumber
      },
      seededUser.id
    );

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
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    await expect(
      updateVehicleApplicationStickerUseCase.execute(
        {
          vehicleApplicationId: seededVehicleApplication.id,
          stickerNumber: ""
        },
        seededUser.id
      )
    ).rejects.toThrow(new BadRequest(" is not a valid sticker number"));
  });

  it("should require PENDING_FOR_STICKER status", async () => {
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    await expect(
      updateVehicleApplicationStickerUseCase.execute(
        {
          vehicleApplicationId: seededVehicleApplication.id,
          stickerNumber: `${new Date().getFullYear()}${faker.number.int({ min: 1000, max: 9999 })}`
        },
        seededUser.id
      )
    ).rejects.toThrow(BadRequest);
  });

  it("should throw NotFoundError when vehicle application id does not exist", async () => {
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    await expect(
      updateVehicleApplicationStickerUseCase.execute(
        {
          vehicleApplicationId: faker.string.uuid(),
          stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
        },
        seededUser.id
      )
    ).rejects.toThrow(new NotFoundError("Vehicle Application Not Found"));
  });

  it("should validate empty vehicle application id before lookup", async () => {
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    await expect(
      updateVehicleApplicationStickerUseCase.execute(
        {
          vehicleApplicationId: "",
          stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
        },
        seededUser.id
      )
    ).rejects.toThrow(new BadRequest("Vehicle Application Not Found"));
  });
});
