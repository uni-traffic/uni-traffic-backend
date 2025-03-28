import { faker } from "@faker-js/faker";
import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { VehicleApplicationStatus } from "../../src/domain/models/vehicleApplication/classes/vehicleApplicationStatus";
import { VehicleApplicationRepository } from "../../src/repositories/vehicleApplicationRepository";
import { UpdateVehicleApplicationStatusUseCase } from "../../src/useCases/updateVehicleApplicationStatusUseCase";
import { seedVehicleApplication } from "../utils/seedVehicleApplication";

describe("UpdateVehicleApplicationStatusUseCase", () => {
  let updateVehicleApplicationStatusUseCase: UpdateVehicleApplicationStatusUseCase;
  let vehicleApplicationRepository: VehicleApplicationRepository;

  beforeAll(async () => {
    updateVehicleApplicationStatusUseCase = new UpdateVehicleApplicationStatusUseCase();
    vehicleApplicationRepository = new VehicleApplicationRepository();
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
  });

  it("should successfully update the vehicle application status(PENDING_FOR_SECURITY_APPROVAL)", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_SECURITY_APPROVAL"
    });

    const updatedVehicleApplication = await updateVehicleApplicationStatusUseCase.execute({
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_PAYMENT"
    });

    expect(updatedVehicleApplication.status).toBe("PENDING_FOR_PAYMENT");

    const vehicleApplicationFromDatabase =
      await vehicleApplicationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.status.value).toBe("PENDING_FOR_PAYMENT");
  });

  it("should successfully update the vehicle application status(PENDING_FOR_PAYMENT)", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const updatedVehicleApplication = await updateVehicleApplicationStatusUseCase.execute({
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_STICKER"
    });

    expect(updatedVehicleApplication.status).toBe("PENDING_FOR_STICKER");

    const vehicleApplicationFromDatabase =
      await vehicleApplicationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.status.value).toBe("PENDING_FOR_STICKER");
  });

  it("should successfully update the vehicle application status(PENDING_FOR_STICKER)", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const updatedVehicleApplication = await updateVehicleApplicationStatusUseCase.execute({
      vehicleApplicationId: seededVehicleApplication.id,
      status: "APPROVED"
    });

    expect(updatedVehicleApplication.status).toBe("APPROVED");

    const vehicleApplicationFromDatabase =
      await vehicleApplicationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.status.value).toBe("APPROVED");
  });

  it("should throw an BadRequest if the status is APPROVED and the vehicle application status goes backward update", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "APPROVED"
    });
    const newStatus = "PENDING_FOR_SECURITY_APPROVAL";

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: newStatus
      })
    ).rejects.toThrow(
      new BadRequest(`Invalid transition from ${seededVehicleApplication.status} to ${newStatus}`)
    );
  });

  it("should throw an BadRequest if the status is REJECTED and the vehicle application status goes backward update", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "REJECTED"
    });
    const newStatus = "PENDING_FOR_SECURITY_APPROVAL";

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: newStatus
      })
    ).rejects.toThrow(
      new BadRequest(`Invalid transition from ${seededVehicleApplication.status} to ${newStatus}`)
    );
  });

  it("should throw an BadRequest if the status is REJECTED and there's no remarks", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_SECURITY_APPROVAL"
    });

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: "REJECTED"
      })
    ).rejects.toThrow(new BadRequest("Remarks are required when setting status to REJECTED."));
  });

  it("should throw an BadRequest if the vehicle application status goes backward update status", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });
    const newStatus = "PENDING_FOR_SECURITY_APPROVAL";

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: newStatus
      })
    ).rejects.toThrow(
      new BadRequest(`Invalid transition from ${seededVehicleApplication.status} to ${newStatus}`)
    );
  });

  it("should throw an BadRequest when the given status does not exist in the database", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: "Non-existing Status"
      })
    ).rejects.toThrow(
      new BadRequest(
        `Invalid VehicleApplication status. Valid types are ${VehicleApplicationStatus.validStatuses.join(", ")}`
      )
    );
  });

  it("should throw an NotFoundError when vehicle application id does not exist in database", async () => {
    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: faker.string.uuid(),
        status: "PENDING_FOR_PAYMENT"
      })
    ).rejects.toThrow(new NotFoundError("Vehicle Application Not Found"));
  });
});
