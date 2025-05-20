import { faker } from "@faker-js/faker";
import { VehicleApplication } from "../../../../../src/domain/models/vehicleApplication/classes/vehicleApplication";
import { VehicleApplicationDriver } from "../../../../../src/domain/models/vehicleApplication/classes/vehicleApplicationDriver";
import { VehicleApplicationSchoolMember } from "../../../../../src/domain/models/vehicleApplication/classes/vehicleApplicationSchoolMember";
import { VehicleApplicationStatus } from "../../../../../src/domain/models/vehicleApplication/classes/vehicleApplicationStatus";
import { VehicleApplicationVehicle } from "../../../../../src/domain/models/vehicleApplication/classes/vehicleApplicationVehicle";

describe("VehicleApplication", () => {
  it("should create a valid VehicleApplication", () => {
    const validProps = {
      id: faker.string.uuid(),
      schoolMember: VehicleApplicationSchoolMember.create({
        schoolId: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        type: "STUDENT",
        schoolCredential: faker.image.url()
      }).getValue(),
      driver: VehicleApplicationDriver.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        licenseId: faker.string.uuid(),
        licenseImage: faker.image.url(),
        selfiePicture: faker.image.url()
      }).getValue(),
      vehicle: VehicleApplicationVehicle.create({
        make: faker.vehicle.manufacturer(),
        series: faker.vehicle.model(),
        type: "CAR",
        model: faker.vehicle.type(),
        licensePlate: faker.vehicle.vrm(),
        certificateOfRegistration: faker.string.uuid(),
        officialReceipt: faker.string.uuid(),
        frontImage: faker.image.url(),
        sideImage: faker.image.url(),
        backImage: faker.image.url()
      }).getValue(),
      status: VehicleApplicationStatus.create(
        faker.helpers.arrayElement(VehicleApplicationStatus.validStatuses)
      ).getValue(),
      stickerNumber: faker.string.uuid(),
      remarks: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      applicantId: faker.string.uuid()
    };

    const vehicleApplication = VehicleApplication.create(validProps);

    expect(vehicleApplication).toBeInstanceOf(VehicleApplication);
    expect(vehicleApplication.id).toBe(validProps.id);
    expect(vehicleApplication.schoolMember).toBe(validProps.schoolMember);
    expect(vehicleApplication.driver).toBe(validProps.driver);
    expect(vehicleApplication.vehicle).toBe(validProps.vehicle);
    expect(vehicleApplication.status.value).toBe(validProps.status.value);
    expect(vehicleApplication.stickerNumber).toBe(validProps.stickerNumber);
    expect(vehicleApplication.remarks).toBe(validProps.remarks);
    expect(vehicleApplication.createdAt).toBe(validProps.createdAt);
    expect(vehicleApplication.updatedAt).toBe(validProps.updatedAt);
    expect(vehicleApplication.applicantId).toBe(validProps.applicantId);
  });

  it("should create a VehicleApplication without optional fields", () => {
    const validProps = {
      id: faker.string.uuid(),
      schoolMember: VehicleApplicationSchoolMember.create({
        schoolId: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        type: "STAFF",
        schoolCredential: faker.image.url()
      }).getValue(),
      driver: VehicleApplicationDriver.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        licenseId: faker.string.uuid(),
        licenseImage: faker.image.url(),
        selfiePicture: faker.image.url()
      }).getValue(),
      vehicle: VehicleApplicationVehicle.create({
        make: faker.vehicle.manufacturer(),
        series: faker.vehicle.model(),
        type: "MOTORCYCLE",
        model: faker.vehicle.type(),
        licensePlate: faker.vehicle.vrm(),
        certificateOfRegistration: faker.string.uuid(),
        officialReceipt: faker.string.uuid(),
        frontImage: faker.image.url(),
        sideImage: faker.image.url(),
        backImage: faker.image.url()
      }).getValue(),
      status: VehicleApplicationStatus.create(
        faker.helpers.arrayElement(VehicleApplicationStatus.validStatuses)
      ).getValue(),
      stickerNumber: null,
      remarks: undefined,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      applicantId: faker.string.uuid(),
      applicant: undefined,
      payment: undefined
    };

    const vehicleApplication = VehicleApplication.create(validProps);

    expect(vehicleApplication).toBeInstanceOf(VehicleApplication);
    expect(vehicleApplication.id).toBe(validProps.id);
    expect(vehicleApplication.schoolMember).toBe(validProps.schoolMember);
    expect(vehicleApplication.driver).toBe(validProps.driver);
    expect(vehicleApplication.vehicle).toBe(validProps.vehicle);
    expect(vehicleApplication.status.value).toBe(validProps.status.value);
    expect(vehicleApplication.stickerNumber).toBeNull();
    expect(vehicleApplication.remarks).toBeUndefined();
    expect(vehicleApplication.createdAt).toBe(validProps.createdAt);
    expect(vehicleApplication.updatedAt).toBe(validProps.updatedAt);
    expect(vehicleApplication.applicantId).toBe(validProps.applicantId);
    expect(vehicleApplication.applicant).toBeUndefined();
    expect(vehicleApplication.payment).toBeUndefined();
  });
});
