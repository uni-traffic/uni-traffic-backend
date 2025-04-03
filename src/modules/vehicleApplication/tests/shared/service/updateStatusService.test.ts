import { faker } from "@faker-js/faker";
import type { IUpdateVehicleApplicationProps } from "../../../src/dtos/vehicleApplicationDTO";
import {
  VehicleApplicationService,
  type IVehicleApplicationService
} from "../../../src/shared/service/updateStatusService";
import { seedVehicleApplication } from "../../utils/seedVehicleApplication";
import { BadRequest, NotFoundError } from "../../../../../shared/core/errors";

describe("VehicleApplicationService", () => {
  let service: IVehicleApplicationService;

  beforeAll(() => {
    service = new VehicleApplicationService();
  });

  it("should successfully update the vehicle application status", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });
    const requestParams: IUpdateVehicleApplicationProps = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_STICKER"
    };

    const result = await service.updateStatus(requestParams);

    expect(result).not.toBeNull();
    expect(result?.status).toBe("PENDING_FOR_STICKER");
  });

  it("should fail to update the vehicle application status if vehicle id does not exist", async () => {
    const requestParams: IUpdateVehicleApplicationProps = {
      vehicleApplicationId: faker.string.uuid(),
      status: "PENDING_FOR_STICKER"
    };

    await expect(service.updateStatus(requestParams)).rejects.toThrow(
      new NotFoundError("Vehicle Application Not Found")
    );
  });

  it("should fail to update the vehicle application status if status is already PENDING_FOR_STICKER", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });
    const requestParams: IUpdateVehicleApplicationProps = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_PAYMENT"
    };

    await expect(service.updateStatus(requestParams)).rejects.toThrow(
      new BadRequest(
        `Invalid transition from ${seededVehicleApplication.status} to ${requestParams.status}`
      )
    );
  });
});
