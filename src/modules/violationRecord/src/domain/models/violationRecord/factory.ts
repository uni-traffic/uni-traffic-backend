import { defaultTo } from "rambda";
import { UnexpectedError } from "../../../../../../shared/core/errors";
import { Result } from "../../../../../../shared/core/result";
import type { JSONObject } from "../../../../../../shared/lib/types";
import { uniTrafficId } from "../../../../../../shared/lib/uniTrafficId";
import type { IUserRawObject } from "../../../../../user/src/domain/models/user/constant";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import type { IVehicleRawObject } from "../../../../../vehicle/src/domain/models/vehicle/constant";
import { VehicleFactory } from "../../../../../vehicle/src/domain/models/vehicle/factory";
import { VehicleMapper } from "../../../../../vehicle/src/domain/models/vehicle/mapper";
import type { IVehicleDTO } from "../../../../../vehicle/src/dtos/vehicleDTO";
import type { IViolationRawObject } from "../../../../../violation/src/domain/models/violation/constant";
import { ViolationFactory } from "../../../../../violation/src/domain/models/violation/factory";
import { ViolationMapper } from "../../../../../violation/src/domain/models/violation/mapper";
import type { IViolationDTO } from "../../../../../violation/src/dtos/violationDTO";
import type { IViolationRecordPaymentRawObject } from "../../../../../violationRecordPayment/src/domain/models/violationRecordPayment/constant";
import { ViolationRecordPaymentFactory } from "../../../../../violationRecordPayment/src/domain/models/violationRecordPayment/factory";
import { ViolationRecordPaymentMapper } from "../../../../../violationRecordPayment/src/domain/models/violationRecordPayment/mapper";
import type { IViolationRecordPaymentDTO } from "../../../../../violationRecordPayment/src/dtos/violationRecordPaymentDTO";
import { type IViolationRecord, ViolationRecord } from "./classes/violationRecord";
import { ViolationRecordRemarks } from "./classes/violationRecordRemarks";
import { ViolationRecordStatus } from "./classes/violationRecordStatus";

export interface IViolationRecordFactoryProps {
  id?: string;
  userId: string;
  reportedById: string;
  violationId: string;
  vehicleId: string;
  remarks: string;
  penalty: number;
  evidence: string[];
  createdAt?: Date;
  status?: string;
  user?: IUserRawObject;
  reporter?: IUserRawObject;
  violation?: IViolationRawObject;
  vehicle?: IVehicleRawObject;
  violationRecordPayment?: IViolationRecordPaymentRawObject | null;
}

export class ViolationRecordFactory {
  public static create(props: IViolationRecordFactoryProps): Result<IViolationRecord> {
    const violationRecordPaymentStatusOrError = ViolationRecordStatus.create(
      defaultTo("UNPAID", props.status)
    );
    if (violationRecordPaymentStatusOrError.isFailure) {
      return Result.fail(violationRecordPaymentStatusOrError.getErrorMessage()!);
    }

    const violationRemarksOrError = ViolationRecordRemarks.create(defaultTo("", props.remarks));
    if (violationRemarksOrError.isFailure) {
      return Result.fail(violationRemarksOrError.getErrorMessage()!);
    }

    const userOrUndefined = props.user
      ? ViolationRecordFactory._getUserDTOFromPersistence(props.user)
      : undefined;

    const reporterOrUndefined = props.reporter
      ? ViolationRecordFactory._getUserDTOFromPersistence(props.reporter)
      : undefined;

    const violationOrUndefined = props.violation
      ? ViolationRecordFactory._getViolationDTOFromPersistence(props.violation)
      : undefined;

    const vehicleOrUndefined = props.vehicle
      ? ViolationRecordFactory._getVehicleDTOFromPersistence(props.vehicle)
      : undefined;

    const paymentOrUndefined = props.violationRecordPayment
      ? ViolationRecordFactory._getViolationPaymentDTOFromPersistence(props.violationRecordPayment)
      : undefined;

    return Result.ok<IViolationRecord>(
      ViolationRecord.create({
        ...props,
        id: defaultTo(uniTrafficId(), props.id),
        status: violationRecordPaymentStatusOrError.getValue(),
        user: userOrUndefined,
        remarks: violationRemarksOrError.getValue(),
        createdAt: defaultTo(new Date(), props.createdAt),
        reporter: reporterOrUndefined,
        violation: violationOrUndefined,
        vehicle: vehicleOrUndefined,
        payment: paymentOrUndefined
      })
    );
  }

  private static _getUserDTOFromPersistence(user: IUserRawObject): IUserDTO {
    const userDomainOrError = UserFactory.create(user);
    if (userDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting User from persistence to Domain");
    }

    return new UserMapper().toDTO(userDomainOrError.getValue());
  }

  private static _getVehicleDTOFromPersistence(vehicle: IVehicleRawObject): IVehicleDTO {
    const vehicleDomainOrError = VehicleFactory.create({
      ...vehicle,
      images: vehicle.images as JSONObject,
      schoolMember: vehicle.schoolMember as JSONObject,
      driver: vehicle.driver as JSONObject
    });
    if (vehicleDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting Vehicle from persistence to Domain");
    }

    return new VehicleMapper().toDTO(vehicleDomainOrError.getValue());
  }

  private static _getViolationDTOFromPersistence(violation: IViolationRawObject): IViolationDTO {
    const vehicleDomainOrError = ViolationFactory.create(violation);
    if (vehicleDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting Violation from persistence to Domain");
    }

    return new ViolationMapper().toDTO(vehicleDomainOrError.getValue());
  }

  private static _getViolationPaymentDTOFromPersistence(
    violationPayment: IViolationRecordPaymentRawObject
  ): IViolationRecordPaymentDTO {
    const paymentOrError = ViolationRecordPaymentFactory.create(violationPayment);
    if (paymentOrError.isFailure) {
      throw new UnexpectedError(
        "Error converting ViolationRecordPayment from persistence to Domain"
      );
    }

    return new ViolationRecordPaymentMapper().toDTO(paymentOrError.getValue());
  }
}
