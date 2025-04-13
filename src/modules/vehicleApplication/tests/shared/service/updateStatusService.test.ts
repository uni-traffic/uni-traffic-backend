import { faker } from "@faker-js/faker";
import { BadRequest, NotFoundError } from "../../../../../shared/core/errors";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import type { IUpdateVehicleApplicationProps } from "../../../src/dtos/vehicleApplicationDTO";
import {
  type IVehicleApplicationService,
  VehicleApplicationService
} from "../../../src/shared/service/updateStatusService";
import { seedVehicleApplication } from "../../utils/seedVehicleApplication";

describe("VehicleApplicationService", () => {
  let service: IVehicleApplicationService;

  beforeAll(() => {
    service = new VehicleApplicationService();
  });

  it("should successfully update the vehicle application status", async () => {
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });
    const requestParams: IUpdateVehicleApplicationProps = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_STICKER",
      actorId: seededUser.id
    };

    const result = await service.updateStatus(requestParams);

    expect(result).not.toBeNull();
    expect(result?.status).toBe("PENDING_FOR_STICKER");

    const auditLog = await db.auditLog.findMany({
      where: { objectId: result.id }
    });

    expect(auditLog).toHaveLength(1);
    expect(auditLog[0].actionType).toBe("UPDATE");
  });

  it("should fail to update the vehicle application status if vehicle id does not exist", async () => {
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const requestParams: IUpdateVehicleApplicationProps = {
      vehicleApplicationId: faker.string.uuid(),
      status: "PENDING_FOR_STICKER",
      actorId: seededUser.id
    };

    await expect(service.updateStatus(requestParams)).rejects.toThrow(
      new NotFoundError("Vehicle Application Not Found")
    );
  });

  it("should fail to update the vehicle application status if status is already PENDING_FOR_STICKER", async () => {
    const seededUser = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });
    const requestParams: IUpdateVehicleApplicationProps = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_PAYMENT",
      actorId: seededUser.id
    };

    await expect(service.updateStatus(requestParams)).rejects.toThrow(
      new BadRequest(
        `Invalid transition from ${seededVehicleApplication.status} to ${requestParams.status}`
      )
    );
  });
});
