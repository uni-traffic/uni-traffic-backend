import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { seedVehicleApplication } from "../../../vehicleApplication/tests/utils/seedVehicleApplication";
import { VehicleApplicationPaymentRepository } from "../../src/repositories/vehicleApplicationPaymentRepositories";
import { createVehicleApplicationPaymentDomainObject } from "../utils/createVehicleApplicationPaymentDomainObject";

describe("VehicleApplicationPaymentRepository.createPayment", () => {
  let vehicleApplicationPaymentRepository: VehicleApplicationPaymentRepository;

  beforeAll(() => {
    vehicleApplicationPaymentRepository = new VehicleApplicationPaymentRepository();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully create a vehicle application payment", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const createdPayment = createVehicleApplicationPaymentDomainObject({
      vehicleApplicationId: seededVehicleApplication.id,
      cashierId: seededCashier.id
    });

    const savedPayment = await vehicleApplicationPaymentRepository.createPayment(createdPayment);

    expect(savedPayment).not.toBeNull();
    expect(savedPayment?.cashTendered.value).toBeGreaterThanOrEqual(savedPayment?.amountDue.value!);
  });

  it("should fail to create a vehicle application payment when given params doesn't exist", async () => {
    const createdPayment = createVehicleApplicationPaymentDomainObject({
      vehicleApplicationId: faker.string.uuid(),
      cashierId: faker.string.uuid()
    });

    const savedPayment = await vehicleApplicationPaymentRepository.createPayment(createdPayment);

    expect(savedPayment).toBeNull();
  });
});
