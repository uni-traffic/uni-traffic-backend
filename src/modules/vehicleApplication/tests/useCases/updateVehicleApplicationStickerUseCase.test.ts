import { faker } from "@faker-js/faker";
import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { VehicleApplicationRepository } from "../../src/repositories/vehicleApplicationRepository";
import { UpdateVehicleApplicationStickerUseCase } from "../../src/useCases/updateVehicleApplicationStickerUseCase";
import { seedVehicleApplication } from "../utils/seedVehicleApplication";

describe("UpdateVehicleApplicationStickerUseCase", () => {
  let updateVehicleApplicationStickerUseCase: UpdateVehicleApplicationStickerUseCase;
  let vehicleApplicationRepository: VehicleApplicationRepository;

  beforeAll(async () => {
    vehicleApplicationRepository = new VehicleApplicationRepository();
    updateVehicleApplicationStickerUseCase = new UpdateVehicleApplicationStickerUseCase(
      vehicleApplicationRepository
    );
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
  });

  it("should successfully update the sticker number and status to APPROVED", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });
    const stickerNumber = `STICKER-${faker.string.alphanumeric(6)}`;

    const updatedVehicleApplication = await updateVehicleApplicationStickerUseCase.execute({
      vehicleApplicationId: seededVehicleApplication.id,
      stickerNumber
    });

    expect(updatedVehicleApplication.stickerNumber).toBe(stickerNumber);
    expect(updatedVehicleApplication.status).toBe("APPROVED");

    const vehicleApplicationFromDatabase =
      await vehicleApplicationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.stickerNumber).toBe(stickerNumber);
    expect(vehicleApplicationFromDatabase?.status.value).toBe("APPROVED");
  });

  it("should throw BadRequest when sticker number is empty", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    await expect(
      updateVehicleApplicationStickerUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        stickerNumber: ""
      })
    ).rejects.toThrow(new BadRequest("Sticker number is required"));
  });

  it("should require PENDING_FOR_STICKER status", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    await expect(
      updateVehicleApplicationStickerUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        stickerNumber: "STICKER-123ABC"
      })
    ).rejects.toThrow(BadRequest); 
  });

  it("should throw NotFoundError when vehicle application id does not exist", async () => {
    await expect(
      updateVehicleApplicationStickerUseCase.execute({
        vehicleApplicationId: faker.string.uuid(),
        stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
      })
    ).rejects.toThrow(new NotFoundError("Vehicle Application Not Found"));
  });

  it("should validate empty vehicle application id before lookup", async () => {
    await expect(
      updateVehicleApplicationStickerUseCase.execute({
        vehicleApplicationId: "",
        stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
      })
    ).rejects.toThrow(new BadRequest("Vehicle Application Not Found"));
  });
});
