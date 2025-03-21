import type { UserType, VehicleApplicationStatus, VehicleType } from "@prisma/client";
import { UnexpectedError } from "../../../../../../shared/core/errors";
import type { IVehicleApplicationDTO } from "../../../dtos/vehicleApplicationDTO";
import type { IVehicleApplication } from "./classes/vehicleApplication";
import type { IVehicleApplicationRawObject, IVehicleApplicationSchema } from "./constant";
import { VehicleApplicationFactory } from "./factory";

export interface IVehicleApplicationMapper {
  toPersistence(vehicleApplication: IVehicleApplication): IVehicleApplicationSchema;
  toDomain(raw: IVehicleApplicationRawObject): IVehicleApplication;
  toDTO(vehicleApplication: IVehicleApplication): IVehicleApplicationDTO;
}

export class VehicleApplicationMapper implements IVehicleApplicationMapper {
  public toDomain(raw: IVehicleApplicationRawObject): IVehicleApplication {
    const vehicleOrError = VehicleApplicationFactory.create(raw);
    if (vehicleOrError.isFailure) {
      throw new UnexpectedError(vehicleOrError.getErrorMessage()!);
    }

    return vehicleOrError.getValue();
  }

  public toPersistence(vehicleApplication: IVehicleApplication): IVehicleApplicationSchema {
    return {
      id: vehicleApplication.id,
      applicantId: vehicleApplication.applicantId,

      schoolId: vehicleApplication.schoolMember.schoolId,
      lastName: vehicleApplication.schoolMember.lastName,
      firstName: vehicleApplication.schoolMember.firstName,
      userType: vehicleApplication.schoolMember.type as UserType,
      schoolCredential: vehicleApplication.schoolMember.schoolCredential,

      driverLastName: vehicleApplication.driver.lastName,
      driverFirstName: vehicleApplication.driver.firstName,
      driverLicenseId: vehicleApplication.driver.licenseId,
      driverLicenseImage: vehicleApplication.driver.licenseImage,

      make: vehicleApplication.vehicle.make,
      series: vehicleApplication.vehicle.series,
      type: vehicleApplication.vehicle.type as VehicleType,
      model: vehicleApplication.vehicle.model,
      licensePlate: vehicleApplication.vehicle.licensePlate,
      certificateOfRegistration: vehicleApplication.vehicle.certificateOfRegistration,
      officialReceipt: vehicleApplication.vehicle.officialReceipt,
      frontImage: vehicleApplication.vehicle.frontImage,
      sideImage: vehicleApplication.vehicle.sideImage,
      backImage: vehicleApplication.vehicle.backImage,

      status: vehicleApplication.status.value as VehicleApplicationStatus,
      stickerNumber: vehicleApplication.stickerNumber,
      remarks: vehicleApplication.remarks,
      createdAt: vehicleApplication.createdAt,
      updatedAt: vehicleApplication.updatedAt
    };
  }

  public toDTO(vehicleApplication: IVehicleApplication): IVehicleApplicationDTO {
    return {
      id: vehicleApplication.id,
      stickerNumber: vehicleApplication.stickerNumber,
      remarks: vehicleApplication.remarks,
      createdAt: vehicleApplication.createdAt,
      updatedAt: vehicleApplication.updatedAt,
      schoolMember: {
        schoolId: vehicleApplication.schoolMember.schoolId,
        lastName: vehicleApplication.schoolMember.lastName,
        firstName: vehicleApplication.schoolMember.firstName,
        type: vehicleApplication.schoolMember.type,
        schoolCredential: vehicleApplication.schoolMember.schoolCredential
      },
      driver: {
        firstName: vehicleApplication.driver.firstName,
        lastName: vehicleApplication.driver.lastName,
        licenseId: vehicleApplication.driver.licenseId,
        licenseImage: vehicleApplication.driver.licenseImage
      },
      vehicle: {
        make: vehicleApplication.vehicle.make,
        series: vehicleApplication.vehicle.series,
        type: vehicleApplication.vehicle.type,
        model: vehicleApplication.vehicle.model,
        licensePlate: vehicleApplication.vehicle.licensePlate,
        certificateOfRegistration: vehicleApplication.vehicle.certificateOfRegistration,
        officialReceipt: vehicleApplication.vehicle.officialReceipt,
        frontImage: vehicleApplication.vehicle.frontImage,
        backImage: vehicleApplication.vehicle.backImage,
        sideImage: vehicleApplication.vehicle.sideImage
      },
      status: vehicleApplication.status.value,
      applicantId: vehicleApplication.applicantId,
      applicant: vehicleApplication.applicant,
      payment: vehicleApplication.payment
    };
  }
}
