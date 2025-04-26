import { faker } from "@faker-js/faker";
import { NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { FileService } from "../../../file/src/service/fileService";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { GetVehicleApplication } from "../../src/useCases/getVehicleApplication";
import { seedVehicleApplication } from "../utils/seedVehicleApplication";

describe("GetVehicleApplicationByPropertyUseCase", () => {
  let getVehicleApplicationUseCase: GetVehicleApplication;

  beforeAll(() => {
    jest.spyOn(FileService.prototype, "getSignedUrl").mockResolvedValue({
      signedUrl: "https://mocked-url.com/signed-url"
    });

    jest.spyOn(FileService.prototype, "uploadFile").mockResolvedValue({
      path: "/mocked/path/file.jpg"
    });

    getVehicleApplicationUseCase = new GetVehicleApplication();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await db.$disconnect();
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
  });

  it("should return number of violation record audit log with count given", async () => {
    await Promise.all([
      seedVehicleApplication({}),
      seedVehicleApplication({}),
      seedVehicleApplication({}),
      seedVehicleApplication({})
    ]);

    const result = await getVehicleApplicationUseCase.execute({
      count: "3",
      page: "1"
    });

    expect(result.vehicleApplication.length).toBe(3);
    expect(result).not.toBe([]);
  });

  it("should return record that matches the given id", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});

    const result = await getVehicleApplicationUseCase.execute({
      id: seededVehicleApplication.id,
      page: "1",
      count: "1"
    });

    expect(result.vehicleApplication.length).toBe(1);
    expect(result.vehicleApplication[0].id).toBe(seededVehicleApplication.id);
  });

  it("should return record that matches the applicant id", async () => {
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

    const result = await getVehicleApplicationUseCase.execute({
      applicantId: seededUser.id,
      page: "1",
      count: "3"
    });
    const mappedVehicleApplication = result.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(result.vehicleApplication.length).toBe(3);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication3.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication4.id);
  });

  it("should return record that matches the school id", async () => {
    const schoolIdFaker = faker.string.uuid();

    const seededVehicleApplication1 = await seedVehicleApplication({
      schoolId: schoolIdFaker
    });

    const seededVehicleApplication2 = await seedVehicleApplication({
      schoolId: schoolIdFaker
    });

    const result = await getVehicleApplicationUseCase.execute({
      schoolId: schoolIdFaker,
      page: "1",
      count: "2"
    });
    const mappedVehicleApplication = result.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(result.vehicleApplication.length).toBe(2);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
  });

  it("should return record that matches the user type", async () => {
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

    const result = await getVehicleApplicationUseCase.execute({
      userType: "STUDENT",
      page: "1",
      count: "3"
    });
    const mappedVehicleApplication = result.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(result.vehicleApplication.length).toBe(3);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication3.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication4.id);
  });

  it("should return record that matches the driver license id", async () => {
    const driverLicense = faker.string.uuid();

    const seededVehicleApplication1 = await seedVehicleApplication({
      driverLicenseId: driverLicense
    });

    const seededVehicleApplication2 = await seedVehicleApplication({
      driverLicenseId: driverLicense
    });

    const result = await getVehicleApplicationUseCase.execute({
      driverLicenseId: driverLicense,
      page: "1",
      count: "2"
    });
    const mappedVehicleApplication = result.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(result.vehicleApplication.length).toBe(2);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
  });

  it("should return record that matches the license plate ", async () => {
    const licensePlate = faker.string.uuid();

    const seededVehicleApplication1 = await seedVehicleApplication({
      licensePlate: licensePlate
    });

    const seededVehicleApplication2 = await seedVehicleApplication({
      licensePlate: licensePlate
    });

    const result = await getVehicleApplicationUseCase.execute({
      licensePlate: licensePlate,
      page: "1",
      count: "2"
    });
    const mappedVehicleApplication = result.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(result.vehicleApplication.length).toBe(2);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
  });

  it("should return record that matches the status", async () => {
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

    const result = await getVehicleApplicationUseCase.execute({
      status: statusApprove,
      page: "1",
      count: "4"
    });
    const mappedVehicleApplication = result.vehicleApplication.map(
      (vehicleApplication) => vehicleApplication.id
    );

    expect(result.vehicleApplication.length).toBe(4);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication3.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication4.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication5.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication6.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication7.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication8.id);
  });

  it("should throw an error when the given id does not exist", async () => {
    await seedVehicleApplication({});

    await expect(
      getVehicleApplicationUseCase.execute({
        id: faker.string.uuid(),
        page: "1",
        count: "1"
      })
    ).rejects.toThrow(new NotFoundError("Vehicle Application not found"));
  });

  it("should return paginated audit logs with correct metadata on first page", async () => {
    const user = await seedUser({});
    await Promise.all(
      Array.from({ length: 15 }).map(() => seedVehicleApplication({ applicantId: user.id }))
    );

    const result = await getVehicleApplicationUseCase.execute({
      applicantId: user.id,
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication).toHaveLength(10);
    expect(result.hasNextPage).toBe(true);
    expect(result.totalPages).toBe(2);
    expect(result.hasPreviousPage).toBe(false);
  });

  it("should return second page with correct hasPreviousPage and hasNextPage flags", async () => {
    const user = await seedUser({});
    await Promise.all(
      Array.from({ length: 15 }).map(() => seedVehicleApplication({ applicantId: user.id }))
    );

    const result = await getVehicleApplicationUseCase.execute({
      applicantId: user.id,
      count: "10",
      page: "2"
    });

    expect(result.vehicleApplication).toHaveLength(5);
    expect(result.hasNextPage).toBe(false);
    expect(result.totalPages).toBe(2);
    expect(result.hasPreviousPage).toBe(true);
  });

  it("should return vehicleApplication sorted in ascending order when sort = 1", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2024-01-01") }),
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const result = await getVehicleApplicationUseCase.execute({
      applicantId: user.id,
      count: "10",
      page: "1",
      sort: "1"
    });

    expect(result.vehicleApplication).toHaveLength(2);
    expect(new Date(result.vehicleApplication[1].createdAt).getTime()).toBeGreaterThan(
      new Date(result.vehicleApplication[0].createdAt).getTime()
    );
  });

  it("should return vehicleApplication sorted in descending order when sort = 2", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2024-01-01") }),
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const result = await getVehicleApplicationUseCase.execute({
      applicantId: user.id,
      count: "10",
      page: "1",
      sort: "2"
    });

    expect(result.vehicleApplication).toHaveLength(2);
    expect(new Date(result.vehicleApplication[0].createdAt).getTime()).toBeGreaterThan(
      new Date(result.vehicleApplication[1].createdAt).getTime()
    );
  });

  it("should return vehicleApplication default sort to descending(2) when sort is does not exist", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2024-01-01") }),
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const result = await getVehicleApplicationUseCase.execute({
      applicantId: user.id,
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication).toHaveLength(2);
    expect(new Date(result.vehicleApplication[0].createdAt).getTime()).toBeGreaterThan(
      new Date(result.vehicleApplication[1].createdAt).getTime()
    );
  });

  it("should filter vehicleApplication using partial applicantId match with searchKey", async () => {
    const user = await seedUser({});
    const applicantId = user.id;
    await seedVehicleApplication({ applicantId: applicantId });

    const result = await getVehicleApplicationUseCase.execute({
      searchKey: applicantId.slice(0, 8),
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication.length).toBeGreaterThan(0);
    expect(result.vehicleApplication[0].applicantId).toContain(applicantId.slice(0, 8));
  });

  it("should filter vehicleApplication using partial id match with searchKey", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});

    const result = await getVehicleApplicationUseCase.execute({
      searchKey: seededVehicleApplication.id.slice(0, 8),
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication.length).toBeGreaterThan(0);
    expect(result.vehicleApplication[0].id).toContain(seededVehicleApplication.id.slice(0, 8));
  });

  it("should filter vehicleApplication using partial driverLastName match with searchKey", async () => {
    await seedVehicleApplication({ driverLastName: "Herrera" });

    const result = await getVehicleApplicationUseCase.execute({
      searchKey: "Herr",
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication.length).toBeGreaterThan(0);
    expect(result.vehicleApplication[0].driver.lastName).toContain("Herr");
  });

  it("should filter vehicleApplication using partial driverFirstName match with searchKey", async () => {
    await seedVehicleApplication({ driverFirstName: "Angelo Robee" });

    const result = await getVehicleApplicationUseCase.execute({
      searchKey: "Angelo",
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication.length).toBeGreaterThan(0);
    expect(result.vehicleApplication[0].driver.firstName).toContain("Angelo");
  });

  it("should filter vehicleApplication using partial lastName match with searchKey", async () => {
    await seedVehicleApplication({ lastName: "Montajes" });

    const result = await getVehicleApplicationUseCase.execute({
      searchKey: "Mont",
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication.length).toBeGreaterThan(0);
    expect(result.vehicleApplication[0].schoolMember.lastName).toContain("Mont");
  });

  it("should filter vehicleApplication using partial firstName match with searchKey", async () => {
    await seedVehicleApplication({ firstName: "French William" });

    const result = await getVehicleApplicationUseCase.execute({
      searchKey: "French",
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication.length).toBeGreaterThan(0);
    expect(result.vehicleApplication[0].schoolMember.firstName).toContain("French");
  });

  it("should filter vehicleApplication using partial schoolId match with searchKey", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});

    const result = await getVehicleApplicationUseCase.execute({
      searchKey: seededVehicleApplication.schoolId.slice(0, 5),
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication.length).toBeGreaterThan(0);
    expect(result.vehicleApplication[0].schoolMember.schoolId).toContain(
      seededVehicleApplication.schoolId.slice(0, 5)
    );
  });

  it("should filter vehicleApplication using strict matching with the given parameters", async () => {
    const user = await seedUser({});
    const seededVehicleApplication = await seedVehicleApplication({
      applicantId: user.id,
      userType: "STUDENT",
      status: "PENDING_FOR_PAYMENT"
    });

    const result = await getVehicleApplicationUseCase.execute({
      id: seededVehicleApplication.id,
      applicantId: user.id,
      driverLastName: seededVehicleApplication.driverLastName,
      driverFirstName: seededVehicleApplication.driverFirstName,
      firstName: seededVehicleApplication.firstName,
      lastName: seededVehicleApplication.lastName,
      schoolId: seededVehicleApplication.schoolId,
      userType: "STUDENT",
      status: "PENDING_FOR_PAYMENT",
      count: "10",
      page: "1"
    });

    expect(result.vehicleApplication[0].id).toBe(seededVehicleApplication.id);
    expect(result.vehicleApplication[0].applicantId).toBe(seededVehicleApplication.applicantId);
    expect(result.vehicleApplication[0].driver.lastName).toBe(
      seededVehicleApplication.driverLastName
    );
    expect(result.vehicleApplication[0].driver.firstName).toBe(
      seededVehicleApplication.driverFirstName
    );
    expect(result.vehicleApplication[0].schoolMember.lastName).toBe(
      seededVehicleApplication.lastName
    );
    expect(result.vehicleApplication[0].schoolMember.firstName).toBe(
      seededVehicleApplication.firstName
    );
    expect(result.vehicleApplication[0].schoolMember.schoolId).toBe(
      seededVehicleApplication.schoolId
    );
  });
});
