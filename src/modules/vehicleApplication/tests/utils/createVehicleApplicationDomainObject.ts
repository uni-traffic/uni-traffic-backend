import { faker } from "@faker-js/faker";
import type { VehicleType } from "@prisma/client";
import { uniTrafficId } from "../../../../shared/lib/uniTrafficId";
import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import { VehicleApplication } from "../../src/domain/models/vehicleApplication/classes/vehicleApplication";
import { VehicleApplicationDriver } from "../../src/domain/models/vehicleApplication/classes/vehicleApplicationDriver";
import { VehicleApplicationSchoolMember } from "../../src/domain/models/vehicleApplication/classes/vehicleApplicationSchoolMember";
import { VehicleApplicationStatus } from "../../src/domain/models/vehicleApplication/classes/vehicleApplicationStatus";
import { VehicleApplicationVehicle } from "../../src/domain/models/vehicleApplication/classes/vehicleApplicationVehicle";

export const createVehicleApplicationDomainObject = ({
  id = uniTrafficId(),
  schoolMember = VehicleApplicationSchoolMember.create({
    schoolId: faker.commerce.isbn(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    type: faker.helpers.arrayElement(["STUDENT", "STAFF"]),
    schoolCredential: faker.image.url()
  }).getValue(),
  driver = VehicleApplicationDriver.create({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    licenseId: faker.commerce.isbn(),
    licenseImage: faker.image.url()
  }).getValue(),
  vehicle = VehicleApplicationVehicle.create({
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
  }).getValue(),
  status = VehicleApplicationStatus.create(
    faker.helpers.arrayElement(VehicleApplicationStatus.validStatuses)
  ).getValue(),
  stickerNumber = faker.number.int({ min: 1_000_000, max: 9_999_999 }).toString(),
  remarks = faker.lorem.sentence({ min: 3, max: 5 }),
  createdAt = new Date(),
  updatedAt = new Date(),
  applicantId = uniTrafficId()
}: Partial<{
  id: string;
  schoolMember: VehicleApplicationSchoolMember;
  driver: VehicleApplicationDriver;
  vehicle: VehicleApplicationVehicle;
  status: VehicleApplicationStatus;
  stickerNumber: string | null;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
  applicantId: string;
  applicant?: IUserDTO;
}>) => {
  const applicant = {
    id: applicantId,
    username: faker.internet.username(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: "GUEST",
    email: faker.internet.email()
  };

  return VehicleApplication.create({
    id,
    schoolMember,
    driver,
    vehicle,
    status,
    stickerNumber,
    remarks,
    createdAt,
    updatedAt,
    applicant,
    applicantId
  });
};
