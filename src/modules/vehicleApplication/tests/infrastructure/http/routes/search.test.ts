import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { FileService } from "../../../../../file/src/service/fileService";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../../user/tests/utils/user/seedUser";
import type { GetVehicleApplicationResponse } from "../../../../src/dtos/vehicleApplicationDTO";
import type { VehicleApplicationGetRequest } from "../../../../src/dtos/vehicleApplicationRequestSchema";
import { seedVehicleApplication } from "../../../utils/seedVehicleApplication";

describe("GET /api/v1/vehicle-application/search", () => {
  let requestAPI: TestAgent;

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
    await db.user.deleteMany();
  });

  beforeAll(() => {
    requestAPI = request.agent(app);

    jest.spyOn(FileService.prototype, "getSignedUrl").mockResolvedValue({
      signedUrl: "https://mocked-url.com/signed-url"
    });

    jest.spyOn(FileService.prototype, "uploadFile").mockResolvedValue({
      path: "/mocked/path/file.jpg"
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await db.$disconnect();
  });

  it("should return status 200 status code and vehicle application when valid id is provided", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const payload: VehicleApplicationGetRequest = {
      id: seededVehicleApplication.id,
      page: "1",
      count: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(1);
    expect(responseBody.vehicleApplication[0].id).toBe(seededVehicleApplication.id);
    expect(responseBody.vehicleApplication[0].schoolMember.schoolId).toBe(
      seededVehicleApplication.schoolId
    );
    expect(responseBody.vehicleApplication[0].schoolMember.type).toBe(
      seededVehicleApplication.userType
    );
    expect(responseBody.vehicleApplication[0].driver.licenseId).toBe(
      seededVehicleApplication.driverLicenseId
    );
    expect(responseBody.vehicleApplication[0].vehicle.licensePlate).toBe(
      seededVehicleApplication.licensePlate
    );
    expect(responseBody.vehicleApplication[0].status).toBe(seededVehicleApplication.status);
    expect(responseBody.vehicleApplication[0].applicantId).toBe(
      seededVehicleApplication.applicantId
    );
  });

  it("should return status 200 and number of vehicle application with count given", async () => {
    await seedVehicleApplication({});
    await seedVehicleApplication({});
    await seedVehicleApplication({});
    await seedVehicleApplication({});
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const payload: VehicleApplicationGetRequest = {
      page: "1",
      count: "4"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(4);
    expect(responseBody.vehicleApplication).not.toBe([]);
  });

  it("should return status 200 and record that matches the given id", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const payload: VehicleApplicationGetRequest = {
      id: seededVehicleApplication.id,
      page: "1",
      count: "4"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body;

    expect(responseBody.vehicleApplication.length).toBe(1);
    expect(responseBody.vehicleApplication[0].id).toBe(seededVehicleApplication.id);
  });

  it("should return status 200 and record that matches the applicant id", async () => {
    const seededUser = await seedUser({});
    const seededVehicleApplication1 = await seedVehicleApplication({
      applicantId: seededUser.id
    });
    const seededVehicleApplication2 = await seedVehicleApplication({
      applicantId: seededUser.id
    });
    const seededVehicleApplication3 = await seedVehicleApplication({
      applicantId: seededUser.id
    });
    const seededVehicleApplication4 = await seedVehicleApplication({});

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const payload: VehicleApplicationGetRequest = {
      applicantId: seededUser.id,
      page: "1",
      count: "4"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetVehicleApplicationResponse;
    const mappedVehicleApplication = responseBody.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(responseBody.vehicleApplication.length).toBe(3);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication3.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication4.id);
  });

  it("should return status 200 record that matches the school id", async () => {
    const schoolIdFaker = faker.string.uuid();
    const seededVehicleApplication1 = await seedVehicleApplication({
      schoolId: schoolIdFaker
    });
    const seededVehicleApplication2 = await seedVehicleApplication({
      schoolId: schoolIdFaker
    });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const payload: VehicleApplicationGetRequest = {
      schoolId: schoolIdFaker,
      page: "1",
      count: "4"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetVehicleApplicationResponse;

    const mappedVehicleApplication = responseBody.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(responseBody.vehicleApplication.length).toBe(2);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
  });

  it("should return status 200 and record that matches the user type", async () => {
    const seededVehicleApplication1 = await seedVehicleApplication({
      userType: "STUDENT"
    });
    const seededVehicleApplication2 = await seedVehicleApplication({
      userType: "STUDENT"
    });
    const seededVehicleApplication3 = await seedVehicleApplication({
      userType: "STUDENT"
    });
    const seededVehicleApplication4 = await seedVehicleApplication({
      userType: "STAFF"
    });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const payload: VehicleApplicationGetRequest = {
      userType: "STUDENT",
      page: "1",
      count: "4"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetVehicleApplicationResponse;
    const mappedVehicleApplication = responseBody.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(responseBody.vehicleApplication.length).toBe(3);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication3.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication4.id);
  });

  it("should return status 200 and record that matches the driver license id", async () => {
    const driverLicense = faker.string.uuid();

    const seededVehicleApplication1 = await seedVehicleApplication({
      driverLicenseId: driverLicense
    });

    const seededVehicleApplication2 = await seedVehicleApplication({
      driverLicenseId: driverLicense
    });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const payload: VehicleApplicationGetRequest = {
      driverLicenseId: driverLicense,
      page: "1",
      count: "2"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetVehicleApplicationResponse;
    const mappedVehicleApplication = responseBody.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(responseBody.vehicleApplication.length).toBe(2);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
  });

  it("should return status 200 and record that matches the license plate ", async () => {
    const licensePlate = faker.string.uuid();

    const seededVehicleApplication1 = await seedVehicleApplication({
      licensePlate: licensePlate
    });

    const seededVehicleApplication2 = await seedVehicleApplication({
      licensePlate: licensePlate
    });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const payload: VehicleApplicationGetRequest = {
      licensePlate: licensePlate,
      page: "1",
      count: "2"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetVehicleApplicationResponse;
    const mappedVehicleApplication = responseBody.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(responseBody.vehicleApplication.length).toBe(2);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
  });

  it("should return status 200 and record that matches the status", async () => {
    const statusApprove = "APPROVED";
    const seededVehicleApplication1 = await seedVehicleApplication({
      status: "APPROVED"
    });
    const seededVehicleApplication2 = await seedVehicleApplication({
      status: "APPROVED"
    });
    const seededVehicleApplication3 = await seedVehicleApplication({
      status: "APPROVED"
    });
    const seededVehicleApplication4 = await seedVehicleApplication({
      status: "APPROVED"
    });
    const seededVehicleApplication5 = await seedVehicleApplication({
      status: "REJECTED"
    });
    const seededVehicleApplication6 = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });
    const seededVehicleApplication7 = await seedVehicleApplication({
      status: "PENDING_FOR_SECURITY_APPROVAL"
    });
    const seededVehicleApplication8 = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const payload: VehicleApplicationGetRequest = {
      status: statusApprove,
      page: "1",
      count: "4"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetVehicleApplicationResponse;
    const mappedVehicleApplication = responseBody.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(responseBody.vehicleApplication.length).toBe(4);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication3.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication4.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication5.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication6.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication7.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication8.id);
  });

  it("should return status 200 and paginated users with correct metadata on first page", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const user = await seedUser({});
    await Promise.all(
      Array.from({ length: 15 }).map(() => seedVehicleApplication({ applicantId: user.id }))
    );

    const payload: VehicleApplicationGetRequest = {
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(10);
    expect(responseBody.hasNextPage).toBe(true);
    expect(responseBody.hasPreviousPage).toBe(false);
    expect(responseBody.totalPages).toBe(2);
  });

  it("should return status 200 and paginated users with correct metadata on second page", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const user = await seedUser({});
    await Promise.all(
      Array.from({ length: 15 }).map(() => seedVehicleApplication({ applicantId: user.id }))
    );

    const payload: VehicleApplicationGetRequest = {
      count: "10",
      page: "2"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(5);
    expect(responseBody.hasNextPage).toBe(false);
    expect(responseBody.hasPreviousPage).toBe(true);
    expect(responseBody.totalPages).toBe(2);
  });

  it("should return status 200 and vehicleApplication sorted in ascending order when sort = 1", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const user = await seedUser({});
    await Promise.all([
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2024-01-01") }),
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const payload: VehicleApplicationGetRequest = {
      applicantId: user.id,
      count: "10",
      page: "1",
      sort: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication).toHaveLength(2);
    expect(new Date(responseBody.vehicleApplication[1].createdAt).getTime()).toBeGreaterThan(
      new Date(responseBody.vehicleApplication[0].createdAt).getTime()
    );
  });

  it("should return status 200 and vehicleApplication sorted in descending order when sort = 2", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const user = await seedUser({});
    await Promise.all([
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2024-01-01") }),
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const payload: VehicleApplicationGetRequest = {
      applicantId: user.id,
      count: "10",
      page: "1",
      sort: "2"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication).toHaveLength(2);
    expect(new Date(responseBody.vehicleApplication[0].createdAt).getTime()).toBeGreaterThan(
      new Date(responseBody.vehicleApplication[1].createdAt).getTime()
    );
  });

  it("should return status 200 and default sort to descending when sort does not exist", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const user = await seedUser({});
    await Promise.all([
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2024-01-01") }),
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const payload: VehicleApplicationGetRequest = {
      applicantId: user.id,
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication).toHaveLength(2);
    expect(new Date(responseBody.vehicleApplication[0].createdAt).getTime()).toBeGreaterThan(
      new Date(responseBody.vehicleApplication[1].createdAt).getTime()
    );
  });

  it("should return status 200 and return vehicleApplication when filtering with searchKey(applicantId)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const user = await seedUser({});
    const seededVehicleApplication = await seedVehicleApplication({ applicantId: user.id });

    const payload: VehicleApplicationGetRequest = {
      searchKey: seededVehicleApplication.applicantId.slice(0, 5),
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(1);
    expect(responseBody.vehicleApplication[0].applicantId).toContain(user.id.slice(0, 5));
  });

  it("should return status 200 and return vehicleApplication when filtering with searchKey(id)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const seededVehicleApplication = await seedVehicleApplication({});

    const payload: VehicleApplicationGetRequest = {
      searchKey: seededVehicleApplication.id.slice(0, 5),
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(1);
    expect(responseBody.vehicleApplication[0].id).toContain(
      seededVehicleApplication.id.slice(0, 5)
    );
  });

  it("should return status 200 and return vehicleApplication when filtering with searchKey(schoolId)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const seededVehicleApplication = await seedVehicleApplication({});

    const payload: VehicleApplicationGetRequest = {
      searchKey: seededVehicleApplication.schoolId.slice(0, 5),
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(1);
    expect(responseBody.vehicleApplication[0].schoolMember.schoolId).toContain(
      seededVehicleApplication.schoolId.slice(0, 5)
    );
  });

  it("should return status 200 and return vehicleApplication when filtering with searchKey(driverLastName)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const seededVehicleApplication = await seedVehicleApplication({ driverLastName: "Herrera" });

    const payload: VehicleApplicationGetRequest = {
      searchKey: "Herr",
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(1);
    expect(responseBody.vehicleApplication[0].driver.lastName).toContain("Herr");
  });

  it("should return status 200 and return vehicleApplication when filtering with searchKey(driverFirstName)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const seededVehicleApplication = await seedVehicleApplication({
      driverFirstName: "French William"
    });

    const payload: VehicleApplicationGetRequest = {
      searchKey: "French",
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(1);
    expect(responseBody.vehicleApplication[0].driver.firstName).toContain("French");
  });

  it("should return status 200 and return vehicleApplication when filtering with searchKey(firstName)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const seededVehicleApplication = await seedVehicleApplication({ firstName: "French William" });

    const payload: VehicleApplicationGetRequest = {
      searchKey: "French",
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(1);
    expect(responseBody.vehicleApplication[0].schoolMember.firstName).toContain("French");
  });

  it("should return status 200 and return vehicleApplication when filtering with searchKey(lastName)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const seededVehicleApplication = await seedVehicleApplication({ lastName: "Herrera" });

    const payload: VehicleApplicationGetRequest = {
      searchKey: "Herr",
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetVehicleApplicationResponse;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.length).toBe(1);
    expect(responseBody.vehicleApplication[0].schoolMember.lastName).toContain("Herr");
  });

  it("should return status 400 when no parameters passed", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({});

    expect(response.status).toBe(400);
  });

  it("should return status 403 and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF"])
    });

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        applicantId: faker.string.uuid(),
        page: "1",
        count: "1"
      });

    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have required permission to perform this action."
    );
  });

  it("should return status 401 when the provided Authorization is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      expiration: "1s",
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"])
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        applicantId: faker.string.uuid(),
        page: "1",
        count: "1"
      });

    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return status 401 when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .get("/api/v1/vehicle-application/search")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query({
        id: faker.string.uuid(),
        page: "1",
        count: "1"
      });

    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
