import type { User, VehicleApplicationPayment } from "@prisma/client";
import { defaultTo } from "rambda";
import { UnexpectedError } from "../../../../../../shared/core/errors";
import { Result } from "../../../../../../shared/core/result";
import { uniTrafficId } from "../../../../../../shared/lib/uniTrafficId";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { type IVehicleApplication, VehicleApplication } from "./classes/vehicleApplication";
import { VehicleApplicationDriver } from "./classes/vehicleApplicationDriver";
import { VehicleApplicationSchoolMember } from "./classes/vehicleApplicationSchoolMember";
import { VehicleApplicationStatus } from "./classes/vehicleApplicationStatus";
import { VehicleApplicationVehicle } from "./classes/vehicleApplicationVehicle";

export interface IVehicleApplicationProps {
  id?: string;

  schoolId: string;
  firstName: string;
  lastName: string;
  userType: string;
  schoolCredential: string;

  driverFirstName: string;
  driverLastName: string;
  driverLicenseId: string;
  driverLicenseImage: string;

  make: string;
  series: string;
  type: string;
  model: string;
  licensePlate: string;
  certificateOfRegistration: string;
  officialReceipt: string;
  frontImage: string;
  sideImage: string;
  backImage: string;

  status?: string;
  stickerNumber: string | null;
  remarks: string | null;
  createdAt?: Date;
  updatedAt?: Date;

  applicantId: string;
  applicant?: User;

  payment?: VehicleApplicationPayment | null;
}

export class VehicleApplicationFactory {
  public static create(params: IVehicleApplicationProps): Result<IVehicleApplication> {
    const vehicleApplicationId = params.id ? params.id : uniTrafficId();

    const schoolMemberOrError = VehicleApplicationSchoolMember.create({
      schoolId: params.schoolId,
      lastName: params.lastName,
      firstName: params.firstName,
      type: params.userType,
      schoolCredential: params.schoolCredential
    });
    if (schoolMemberOrError.isFailure) {
      return Result.fail(schoolMemberOrError.getErrorMessage()!);
    }

    const driverOrError = VehicleApplicationDriver.create({
      lastName: params.driverLastName,
      firstName: params.driverFirstName,
      licenseId: params.driverLicenseId,
      licenseImage: params.driverLicenseImage
    });
    if (driverOrError.isFailure) {
      return Result.fail(driverOrError.getErrorMessage()!);
    }

    const vehicleOrError = VehicleApplicationVehicle.create({
      make: params.make,
      series: params.series,
      type: params.type,
      model: params.model,
      licensePlate: params.licensePlate,
      certificateOfRegistration: params.certificateOfRegistration,
      officialReceipt: params.officialReceipt,
      frontImage: params.frontImage,
      sideImage: params.sideImage,
      backImage: params.backImage
    });
    if (vehicleOrError.isFailure) {
      return Result.fail(vehicleOrError.getErrorMessage()!);
    }

    const vehicleApplicationStatus = VehicleApplicationStatus.create(
      defaultTo("PENDING_SECURITY_CLEARANCE", params.status)
    );
    if (vehicleApplicationStatus.isFailure) {
      return Result.fail(vehicleApplicationStatus.getErrorMessage()!);
    }

    const applicantOrError = params.applicant
      ? VehicleApplicationFactory._getUserDTOFromPersistence(params.applicant)
      : undefined;

    /**
     * TODO: convert VehicleApplicationPayment to DTO here
     */
    const payment = undefined;

    return Result.ok(
      VehicleApplication.create({
        ...params,
        id: vehicleApplicationId,
        schoolMember: schoolMemberOrError.getValue(),
        driver: driverOrError.getValue(),
        vehicle: vehicleOrError.getValue(),
        status: vehicleApplicationStatus.getValue(),
        createdAt: defaultTo(new Date(), params.createdAt),
        updatedAt: defaultTo(new Date(), params.updatedAt),
        applicant: applicantOrError,
        payment: payment
      })
    );
  }

  private static _getUserDTOFromPersistence(user: User): IUserDTO {
    const userDomainOrError = UserFactory.create(user);
    if (userDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting User from persistence to Domain");
    }

    return new UserMapper().toDTO(userDomainOrError.getValue());
  }
}
