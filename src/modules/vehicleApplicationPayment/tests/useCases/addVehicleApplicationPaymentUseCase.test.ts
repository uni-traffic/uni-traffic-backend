import { BadRequest } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { VehicleApplicationRepository } from "../../../vehicleApplication/src/repositories/vehicleApplicationRepository";
import { VehicleApplicationService } from "../../../vehicleApplication/src/shared/service/updateStatusService";
import { seedVehicleApplication } from "../../../vehicleApplication/tests/utils/seedVehicleApplication";
import { VehicleApplicationPaymentRepository } from "../../src/repositories/vehicleApplicationPaymentRepositories";
import { AddVehicleApplicationPaymentUseCase } from "../../src/useCases/addVehicleApplicationPaymentUseCase";

describe("AddVehicleApplicationPaymentUseCase", () => {
  let addVehicleApplicationPaymentUseCase: AddVehicleApplicationPaymentUseCase;

  beforeAll(() => {
    const vehicleApplicationRepository = new VehicleApplicationRepository();
    const vehicleApplicationPaymentRepository = new VehicleApplicationPaymentRepository();
    const vehicleApplicationService = new VehicleApplicationService();

    addVehicleApplicationPaymentUseCase = new AddVehicleApplicationPaymentUseCase(
      vehicleApplicationRepository,
      vehicleApplicationPaymentRepository,
      vehicleApplicationService
    );
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
    await db.vehicleApplicationPayment.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully add a vehicle application payment and update status", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const mockRequestData = {
      vehicleApplicationId: seededVehicleApplication.id,
      amountDue: 500,
      cashTendered: 501
    };

    const result = await addVehicleApplicationPaymentUseCase.execute(
      mockRequestData,
      seededCashier.id
    );

    expect(result).toBeDefined();
    expect(result.vehicleApplicationId).toBe(mockRequestData.vehicleApplicationId);

    const updatedRecord = await db.vehicleApplication.findUnique({
      where: { id: seededVehicleApplication.id }
    });

    expect(updatedRecord).toBeDefined();
    expect(updatedRecord?.status).toBe("PENDING_FOR_STICKER");
  });

  it("should fail when the cashTendered is less than the amount due", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const mockRequestData = {
      vehicleApplicationId: seededVehicleApplication.id,
      amountDue: 500,
      cashTendered: 400
    };

    expect(
      addVehicleApplicationPaymentUseCase.execute(mockRequestData, seededCashier.id)
    ).rejects.toThrow(new BadRequest("Cash tendered is less than the required amount due."));
  });

  it("should fail when the status is not PENDING_FOR_PAYMENT", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const mockRequestData = {
      vehicleApplicationId: seededVehicleApplication.id,
      amountDue: 500,
      cashTendered: 501
    };

    expect(
      addVehicleApplicationPaymentUseCase.execute(mockRequestData, seededCashier.id)
    ).rejects.toThrow(
      new BadRequest(
        "Payment can be only be processed for application with status PENDING_FOR_PAYMENT"
      )
    );
  });
});
