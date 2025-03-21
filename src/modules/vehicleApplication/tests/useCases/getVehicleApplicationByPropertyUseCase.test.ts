import { faker } from "@faker-js/faker";
import { NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { FileService } from "../../../file/src/service/fileService";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { GetVehicleApplicationByPropertyUseCase } from "../../src/useCases/getVehicleApplicationByPropertyUseCase";
import { seedVehicleApplication } from "../utils/seedVehicleApplication";

describe("GetVehicleApplicationByPropertyUseCase", () => {
  let getVehicleApplicationByPropertyUseCase: GetVehicleApplicationByPropertyUseCase;

  beforeAll(() => {
    jest.spyOn(FileService.prototype, "getSignedUrl").mockResolvedValue({
      signedUrl: "https://mocked-url.com/signed-url"
    });

    jest.spyOn(FileService.prototype, "uploadFile").mockResolvedValue({
      path: "/mocked/path/file.jpg"
    });

    getVehicleApplicationByPropertyUseCase = new GetVehicleApplicationByPropertyUseCase();
  });

  afterAll(() => {
    jest.restoreAllMocks();
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

    const result = await getVehicleApplicationByPropertyUseCase.execute({
      count: "3",
      page: "1"
    });

    expect(result.length).toBe(3);
    expect(result).not.toBe([]);
  });

  it("should return record that matches the given id", async () => {
    const seededVehicleApplication = await seedVehicleApplication({});

    const result = await getVehicleApplicationByPropertyUseCase.execute({
      id: seededVehicleApplication.id,
      page: "1",
      count: "1"
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

    const result = await getVehicleApplicationByPropertyUseCase.execute({
      applicantId: seededUser.id,
      page: "1",
      count: "3"
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

    const result = await getVehicleApplicationByPropertyUseCase.execute({
      schoolId: schoolIdFaker,
      page: "1",
      count: "2"
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

    const result = await getVehicleApplicationByPropertyUseCase.execute({
      userType: "STUDENT",
      page: "1",
      count: "3"
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

    const result = await getVehicleApplicationByPropertyUseCase.execute({
      driverLicenseId: driverLicense,
      page: "1",
      count: "2"
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

    const result = await getVehicleApplicationByPropertyUseCase.execute({
      licensePlate: licensePlate,
      page: "1",
      count: "2"
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
      status: "DENIED"
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

    const result = await getVehicleApplicationByPropertyUseCase.execute({
      status: statusApprove,
      page: "1",
      count: "4"
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

  it("should throw an error when the given id doesnt not exist", async () => {
    await seedVehicleApplication({});

    await expect(
      getVehicleApplicationByPropertyUseCase.execute({
        id: faker.string.uuid(),
        page: "1",
        count: "1"
      })
    ).rejects.toThrow(new NotFoundError("Vehicle Application not found"));
  });
});
