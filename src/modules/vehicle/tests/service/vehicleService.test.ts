import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { BadRequest, ConflictError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import type { IVehicleFactoryProps } from "../../src/domain/models/vehicle/factory";
import { type IVehicleService, VehicleService } from "../../src/service/vehicleService";
import { seedVehicle } from "../utils/vehicle/seedVehicle";

describe("VehicleService", () => {
  let service: IVehicleService;
  let mockVehicleData: IVehicleFactoryProps;

  beforeAll(() => {
    service = new VehicleService();
  });

  beforeEach(async () => {
    await db.vehicle.deleteMany();

    const seededOwner = await seedUser({ role: "GUEST" });
    mockVehicleData = {
      ownerId: seededOwner.id,
      licensePlate: faker.vehicle.vrm(),
      make: faker.vehicle.manufacturer(),
      model: faker.date.past().getFullYear().toString(),
      series: faker.vehicle.model(),
      color: faker.vehicle.color(),
      type: faker.helpers.arrayElement(["CAR", "MOTORCYCLE"]),
      stickerNumber: faker.number.bigInt({ min: 10_000_000, max: 99_999_999 }).toString(),
      images: {
        front: faker.image.url(),
        side: faker.image.url(),
        back: faker.image.url()
      },
      driver: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        licenseId: faker.string.uuid(),
        licenseImage: faker.image.url(),
        selfiePicture: faker.image.url()
      },
      schoolMember: {
        schoolId: uuid(),
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        type: faker.helpers.arrayElement(["STUDENT", "STAFF"]),
        schoolCredential: faker.string.uuid()
      }
    };
  });

  it("should successfully create a vehicle", async () => {
    const createdVehicle = await service.createVehicle(mockVehicleData);

    expect(createdVehicle).toMatchObject(mockVehicleData);
  });

  it("should throw ConflictError when vehicle with the same license plate already exists", async () => {
    const seededVehicle = await seedVehicle({});

    await expect(
      service.createVehicle({
        ...mockVehicleData,
        licensePlate: seededVehicle.licensePlate
      })
    ).rejects.toThrow(new ConflictError("A vehicle with this license plate already exists."));
  });

  it("should throw BadRequest if one of the constraint fails", async () => {
    await expect(
      service.createVehicle({
        ...mockVehicleData,
        status: "PENDING"
      })
    ).rejects.toThrow(BadRequest);
  });
});
