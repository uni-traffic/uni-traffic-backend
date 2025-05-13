import { faker } from "@faker-js/faker";
import type { VehicleType } from "@prisma/client";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { FileService } from "../../../../../file/src/service/fileService";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import type { VehicleApplicationCreateRequest } from "../../../../src/dtos/vehicleApplicationRequestSchema";

describe("POST api/v1/vehicle-application/create", () => {
  let requestAPI: TestAgent;

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  beforeAll(() => {
    requestAPI = request.agent(app);

    jest.spyOn(FileService.prototype, "moveFile").mockResolvedValue({
      path: "/mocked/path/file.jpg"
    });
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return status code 201 when successfully created a request", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF"])
    });
    const mockRequestBody: VehicleApplicationCreateRequest = {
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
      backImage: faker.image.url()
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/create")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(mockRequestBody);

    expect(response.status).toBe(201);
    expect(response.body.schoolMember.schoolId).toBe(mockRequestBody.schoolId);
    expect(response.body.status).toBe("PENDING_FOR_SECURITY_APPROVAL");
  });
});
