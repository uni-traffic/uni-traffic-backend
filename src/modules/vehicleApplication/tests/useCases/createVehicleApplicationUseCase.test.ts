import { faker } from "@faker-js/faker";
import type { VehicleType } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { FileService } from "../../../file/src/service/fileService";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import type { IVehicleApplicationProps } from "../../src/domain/models/vehicleApplication/factory";
import { CreateVehicleApplicationUseCase } from "../../src/useCases/createVehicleApplicationUseCase";

describe("CreateVehicleApplicationUseCase", () => {
  let createVehicleApplicationUseCase: CreateVehicleApplicationUseCase;

  beforeAll(() => {
    createVehicleApplicationUseCase = new CreateVehicleApplicationUseCase();

    jest.spyOn(FileService.prototype, "moveFile").mockResolvedValue({
      path: "/mocked/path/file.jpg"
    });
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully create vehicle application", async () => {
    const seededUser = await seedUser({ role: "GUEST" });
    const mockRequestParams: IVehicleApplicationProps = {
      schoolId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      userType: faker.helpers.arrayElement(["STUDENT", "STAFF"]),
      schoolCredential: faker.image.url(),

      driverFirstName: faker.person.firstName(),
      driverLastName: faker.person.lastName(),
      driverLicenseId: faker.string.uuid(),
      driverLicenseImage: faker.image.url(),

      make: faker.vehicle.manufacturer(),
      series: faker.vehicle.model(),
      type: faker.helpers.arrayElement(["CAR", "MOTORCYCLE"]) as VehicleType,
      model: faker.vehicle.model(),
      licensePlate: faker.vehicle.vrm(),
      certificateOfRegistration: faker.image.url(),
      officialReceipt: faker.image.url(),
      frontImage: faker.image.url(),
      sideImage: faker.image.url(),
      backImage: faker.image.url(),

      applicantId: seededUser.id
    };

    const result = await createVehicleApplicationUseCase.execute(mockRequestParams);

    expect(result.schoolMember.schoolId).toBe(mockRequestParams.schoolId);
    expect(result.schoolMember.firstName).toBe(mockRequestParams.firstName);
    expect(result.schoolMember.lastName).toBe(mockRequestParams.lastName);
    expect(result.schoolMember.type).toBe(mockRequestParams.userType);

    expect(result.driver.lastName).toBe(mockRequestParams.driverLastName);
    expect(result.driver.firstName).toBe(mockRequestParams.driverFirstName);
    expect(result.driver.licenseId).toBe(mockRequestParams.driverLicenseId);

    expect(result.vehicle.make).toBe(mockRequestParams.make);
    expect(result.vehicle.series).toBe(mockRequestParams.series);
    expect(result.vehicle.type).toBe(mockRequestParams.type);
    expect(result.vehicle.model).toBe(mockRequestParams.model);
    expect(result.vehicle.licensePlate).toBe(mockRequestParams.licensePlate);

    expect(result.applicantId).toBe(mockRequestParams.applicantId);
    expect(result.status).toBe("PENDING_FOR_SECURITY_APPROVAL");
  });
});
