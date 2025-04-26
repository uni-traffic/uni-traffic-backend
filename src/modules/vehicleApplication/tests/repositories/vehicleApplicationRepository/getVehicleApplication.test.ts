import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../../../src/repositories/vehicleApplicationRepository";
import { seedVehicleApplication } from "../../utils/seedVehicleApplication";

describe("VehicleApplicationRepository.getVehicleApplicationByProperty", () => {
  let vehicleApplicationRepository: IVehicleApplicationRepository;

  beforeAll(async () => {
    vehicleApplicationRepository = new VehicleApplicationRepository();
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return number of violation record audit log with count given", async () => {
    await seedVehicleApplication({});
    await seedVehicleApplication({});
    await seedVehicleApplication({});
    await seedVehicleApplication({});

    const result = await vehicleApplicationRepository.getVehicleApplication({
      count: 3,
      page: 1
    });

    expect(result.length).toBe(3);
    expect(result).not.toBe([]);
  });

  it("should return record that matches the given id", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});

    const result = await vehicleApplicationRepository.getVehicleApplication({
      id: seededVehicleApplication.id,
      page: 1,
      count: 1
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededVehicleApplication.id);
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

    const result = await vehicleApplicationRepository.getVehicleApplication({
      applicantId: seededUser.id,
      page: 1,
      count: 3
    });
    const mappedVehicleApplication = result.map((vehicleApplication) => vehicleApplication.id);

    expect(result.length).toBe(3);
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

    const result = await vehicleApplicationRepository.getVehicleApplication({
      schoolId: schoolIdFaker,
      page: 1,
      count: 2
    });
    const mappedVehicleApplication = result.map((vehicleApplication) => vehicleApplication.id);

    expect(result.length).toBe(2);
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

    const result = await vehicleApplicationRepository.getVehicleApplication({
      userType: "STUDENT",
      page: 1,
      count: 3
    });
    const mappedVehicleApplication = result.map((vehicleApplication) => vehicleApplication.id);

    expect(result.length).toBe(3);
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

    const result = await vehicleApplicationRepository.getVehicleApplication({
      driverLicenseId: driverLicense,
      page: 1,
      count: 2
    });
    const mappedVehicleApplication = result.map((vehicleApplication) => vehicleApplication.id);

    expect(result.length).toBe(2);
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

    const result = await vehicleApplicationRepository.getVehicleApplication({
      licensePlate: licensePlate,
      page: 1,
      count: 2
    });
    const mappedVehicleApplication = result.map((vehicleApplication) => vehicleApplication.id);

    expect(result.length).toBe(2);
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

    const result = await vehicleApplicationRepository.getVehicleApplication({
      status: statusApprove,
      page: 1,
      count: 4
    });
    const mappedVehicleApplication = result.map((vehicleApplication) => vehicleApplication.id);

    expect(result.length).toBe(4);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication1.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication2.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication3.id);
    expect(mappedVehicleApplication).toContain(seededVehicleApplication4.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication5.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication6.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication7.id);
    expect(mappedVehicleApplication).not.toContain(seededVehicleApplication8.id);
  });

  it("should return an empty array when the given id does not exist", async () => {
    await seedVehicleApplication({});

    const result = await vehicleApplicationRepository.getVehicleApplication({
      id: faker.string.uuid(),
      page: 1,
      count: 1
    });

    expect(result.length).toBe(0);
    expect(result).toStrictEqual([]);
  });

  it("should return vehicleApplication sorted in ascending order when sort = 1", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2024-01-01") }),
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      applicantId: user.id,
      count: 10,
      page: 1,
      sort: 1
    });

    expect(vehicleApplication).toHaveLength(2);
    expect(new Date(vehicleApplication[1].createdAt).getTime()).toBeGreaterThan(
      new Date(vehicleApplication[0].createdAt).getTime()
    );
  });

  it("should return vehicleApplication sorted in descending order when sort = 2", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2024-01-01") }),
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      applicantId: user.id,
      count: 10,
      page: 1,
      sort: 2
    });

    expect(vehicleApplication).toHaveLength(2);
    expect(new Date(vehicleApplication[0].createdAt).getTime()).toBeGreaterThan(
      new Date(vehicleApplication[1].createdAt).getTime()
    );
  });

  it("should return vehicleApplication default sort to descending(2) when sort is does not exist", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2024-01-01") }),
      seedVehicleApplication({ applicantId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      applicantId: user.id,
      count: 10,
      page: 1
    });

    expect(vehicleApplication).toHaveLength(2);
    expect(new Date(vehicleApplication[0].createdAt).getTime()).toBeGreaterThan(
      new Date(vehicleApplication[1].createdAt).getTime()
    );
  });

  it("should correctly apply pagination", async () => {
    const user = await seedUser({});
    await Promise.all(
      Array.from({ length: 15 }).map(() => seedVehicleApplication({ applicantId: user.id }))
    );

    const page1 = await vehicleApplicationRepository.getVehicleApplication({
      applicantId: user.id,
      count: 10,
      page: 1
    });
    const page2 = await vehicleApplicationRepository.getVehicleApplication({
      applicantId: user.id,
      count: 10,
      page: 2
    });

    expect(page1).toHaveLength(10);
    expect(page2).toHaveLength(5);
  });

  it("should filter vehicleApplication using partial applicantId match with searchKey", async () => {
    const user = await seedUser({});
    const applicantId = user.id;
    await seedVehicleApplication({ applicantId: applicantId });

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      searchKey: applicantId.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(vehicleApplication.length).toBeGreaterThan(0);
    expect(vehicleApplication[0].applicantId).toContain(applicantId.slice(0, 8));
  });

  it("should filter vehicleApplication using partial id match with searchKey", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      searchKey: seededVehicleApplication.id.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(vehicleApplication.length).toBeGreaterThan(0);
    expect(vehicleApplication[0].id).toContain(seededVehicleApplication.id.slice(0, 8));
  });

  it("should filter vehicleApplication using partial driverLastName match with searchKey", async () => {
    await seedVehicleApplication({ driverLastName: "Herrera" });

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      searchKey: "Herr",
      count: 10,
      page: 1
    });

    expect(vehicleApplication.length).toBeGreaterThan(0);
    expect(vehicleApplication[0].driver.lastName).toContain("Herr");
  });

  it("should filter vehicleApplication using partial driverFirstName match with searchKey", async () => {
    await seedVehicleApplication({ driverFirstName: "Angelo Robee" });

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      searchKey: "Angelo",
      count: 10,
      page: 1
    });

    expect(vehicleApplication.length).toBeGreaterThan(0);
    expect(vehicleApplication[0].driver.firstName).toContain("Angelo");
  });

  it("should filter vehicleApplication using partial lastName match with searchKey", async () => {
    await seedVehicleApplication({ lastName: "Montajes" });

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      searchKey: "Mont",
      count: 10,
      page: 1
    });

    expect(vehicleApplication.length).toBeGreaterThan(0);
    expect(vehicleApplication[0].schoolMember.lastName).toContain("Mont");
  });

  it("should filter vehicleApplication using partial firstName match with searchKey", async () => {
    await seedVehicleApplication({ firstName: "French William" });

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      searchKey: "French",
      count: 10,
      page: 1
    });

    expect(vehicleApplication.length).toBeGreaterThan(0);
    expect(vehicleApplication[0].schoolMember.firstName).toContain("French");
  });

  it("should filter vehicleApplication using partial schoolId match with searchKey", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      searchKey: seededVehicleApplication.schoolId.slice(0, 5),
      count: 10,
      page: 1
    });

    expect(vehicleApplication.length).toBeGreaterThan(0);
    expect(vehicleApplication[0].schoolMember.schoolId).toContain(
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

    const vehicleApplication = await vehicleApplicationRepository.getVehicleApplication({
      id: seededVehicleApplication.id,
      applicantId: user.id,
      driverLastName: seededVehicleApplication.driverLastName,
      driverFirstName: seededVehicleApplication.driverFirstName,
      firstName: seededVehicleApplication.firstName,
      lastName: seededVehicleApplication.lastName,
      schoolId: seededVehicleApplication.schoolId,
      userType: "STUDENT",
      status: "PENDING_FOR_PAYMENT",
      count: 10,
      page: 1
    });

    expect(vehicleApplication[0].id).toBe(seededVehicleApplication.id);
    expect(vehicleApplication[0].applicantId).toBe(seededVehicleApplication.applicantId);
    expect(vehicleApplication[0].driver.lastName).toBe(seededVehicleApplication.driverLastName);
    expect(vehicleApplication[0].driver.firstName).toBe(seededVehicleApplication.driverFirstName);
    expect(vehicleApplication[0].schoolMember.lastName).toBe(seededVehicleApplication.lastName);
    expect(vehicleApplication[0].schoolMember.firstName).toBe(seededVehicleApplication.firstName);
    expect(vehicleApplication[0].schoolMember.schoolId).toBe(seededVehicleApplication.schoolId);
  });
});
