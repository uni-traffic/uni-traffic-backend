import { faker } from "@faker-js/faker";
import { BadRequest, ForbiddenError, NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
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
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully update the vehicle application status(PENDING_FOR_SECURITY_APPROVAL)", async () => {
    const seededAuthorizedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_SECURITY_APPROVAL"
    });

    const updatedVehicleApplication = await updateVehicleApplicationStatusUseCase.execute({
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_PAYMENT",
      actorId: seededAuthorizedUser.id
    });

    expect(updatedVehicleApplication.status).toBe("PENDING_FOR_PAYMENT");

    const vehicleApplicationFromDatabase =
      await vehicleApplicationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.status.value).toBe("PENDING_FOR_PAYMENT");

    const auditLog = await db.auditLog.findMany({
      where: { objectId: updatedVehicleApplication.id }
    });

    expect(auditLog).toHaveLength(1);
    expect(auditLog[0].actionType).toBe("UPDATE");
  });

  it("should successfully update the vehicle application status(PENDING_FOR_PAYMENT)", async () => {
    const seededAuthorizedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const updatedVehicleApplication = await updateVehicleApplicationStatusUseCase.execute({
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_STICKER",
      actorId: seededAuthorizedUser.id
    });

    expect(updatedVehicleApplication.status).toBe("PENDING_FOR_STICKER");

    const vehicleApplicationFromDatabase =
      await vehicleApplicationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.status.value).toBe("PENDING_FOR_STICKER");
  });

  it("should successfully update the vehicle application status(PENDING_FOR_STICKER)", async () => {
    const seededAuthorizedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const updatedVehicleApplication = await updateVehicleApplicationStatusUseCase.execute({
      vehicleApplicationId: seededVehicleApplication.id,
      status: "APPROVED",
      actorId: seededAuthorizedUser.id
    });

    expect(updatedVehicleApplication.status).toBe("APPROVED");

    const vehicleApplicationFromDatabase =
      await vehicleApplicationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.status.value).toBe("APPROVED");
  });

  it("should throw an BadRequest if the status is APPROVED and the vehicle application status goes backward update", async () => {
    const seededAuthorizedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "APPROVED"
    });
    const newStatus = "PENDING_FOR_SECURITY_APPROVAL";

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: newStatus,
        actorId: seededAuthorizedUser.id
      })
    ).rejects.toThrow(
      new BadRequest(`Invalid transition from ${seededVehicleApplication.status} to ${newStatus}`)
    );
  });

  it("should throw an BadRequest if the status is REJECTED and the vehicle application status goes backward update", async () => {
    const seededAuthorizedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "REJECTED"
    });
    const newStatus = "PENDING_FOR_SECURITY_APPROVAL";

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: newStatus,
        actorId: seededAuthorizedUser.id
      })
    ).rejects.toThrow(
      new BadRequest(`Invalid transition from ${seededVehicleApplication.status} to ${newStatus}`)
    );
  });

  it("should throw an BadRequest if the status is REJECTED and there's no remarks", async () => {
    const seededAuthorizedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_SECURITY_APPROVAL"
    });

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: "REJECTED",
        actorId: seededAuthorizedUser.id
      })
    ).rejects.toThrow(new BadRequest("Remarks are required when setting status to REJECTED."));
  });

  it("should throw an BadRequest if the vehicle application status goes backward update status", async () => {
    const seededAuthorizedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });
    const newStatus = "PENDING_FOR_SECURITY_APPROVAL";

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: newStatus,
        actorId: seededAuthorizedUser.id
      })
    ).rejects.toThrow(
      new BadRequest(`Invalid transition from ${seededVehicleApplication.status} to ${newStatus}`)
    );
  });

  it("should throw an BadRequest when the given status does not exist in the database", async () => {
    const seededAuthorizedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    const seededVehicleApplication = await seedVehicleApplication({});

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: seededVehicleApplication.id,
        status: "Non-existing Status",
        actorId: seededAuthorizedUser.id
      })
    ).rejects.toThrow(
      new BadRequest(
        `Invalid VehicleApplication status. Valid types are ${VehicleApplicationStatus.validStatuses.join(", ")}`
      )
    );
  });

  it("should throw an NotFoundError when vehicle application id does not exist in database", async () => {
    const seededAuthorizedUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: faker.string.uuid(),
        status: "PENDING_FOR_PAYMENT",
        actorId: seededAuthorizedUser.id
      })
    ).rejects.toThrow(new NotFoundError("Vehicle Application Not Found"));
  });

  it("should throw ForbiddenError when actor lacks permission", async () => {
    const seededAuthenticatedUser = await seedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF"])
    });

    await expect(
      updateVehicleApplicationStatusUseCase.execute({
        vehicleApplicationId: faker.string.uuid(),
        status: "PENDING_FOR_PAYMENT",
        actorId: seededAuthenticatedUser.id
      })
    ).rejects.toThrow(new ForbiddenError("You do not have permission to perform this action."));
  });
});
