import { faker } from "@faker-js/faker";
import { VehicleApplicationStatus, type VehicleType } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { uniTrafficId } from "../../../../shared/lib/uniTrafficId";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import type { IVehicleApplicationRawObject } from "../../src/domain/models/vehicleApplication/constant";

export const seedVehicleApplication = async ({
  id = uniTrafficId(),
  schoolId = uuid(),
  firstName = faker.person.firstName(),
  lastName = faker.person.lastName(),
  userType = faker.helpers.arrayElement(["STUDENT", "STAFF"]),
  schoolCredential = faker.image.url(),
  driverFirstName = faker.person.firstName(),
  driverLastName = faker.person.lastName(),
  driverLicenseId = faker.number.int({ min: 100_000_000, max: 999_999_999 }).toString(),
  driverLicenseImage = faker.image.url(),
  make = faker.vehicle.manufacturer(),
  series = faker.vehicle.model(),
  type = faker.helpers.arrayElement(["CAR", "MOTORCYCLE"]) as VehicleType,
  model = faker.vehicle.model(),
  licensePlate = faker.vehicle.vrm(),
  certificateOfRegistration = faker.image.url(),
  officialReceipt = faker.image.url(),
  frontImage = faker.image.url(),
  sideImage = faker.image.url(),
  backImage = faker.image.url(),
  status = faker.helpers.arrayElement(Object.values(VehicleApplicationStatus)),
  stickerNumber = faker.number.int({ min: 1_000_000, max: 9_999_999 }).toString(),
  remarks = faker.lorem.sentence(),
  createdAt = faker.date.past(),
  updatedAt = faker.date.recent(),
  applicantId
}: Partial<IVehicleApplicationRawObject>) => {
  const applicantUserId = applicantId ? applicantId : (await seedUser({ role: "GUEST" })).id;

  return db.vehicleApplication.create({
    data: {
      id,
      schoolId,
      firstName,
      lastName,
      userType,
      schoolCredential,
      driverFirstName,
      driverLastName,
      driverLicenseId,
      driverLicenseImage,
      make,
      series,
      type,
      model,
      licensePlate,
      certificateOfRegistration,
      officialReceipt,
      frontImage,
      sideImage,
      backImage,
      status,
      stickerNumber,
      remarks,
      createdAt,
      updatedAt,
      applicantId: applicantUserId
    }
  });
};
