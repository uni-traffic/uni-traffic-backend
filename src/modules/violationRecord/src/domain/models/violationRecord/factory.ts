import type { User, Vehicle, Violation } from "@prisma/client";
import { defaultTo } from "rambda";
import { UnexpectedError } from "../../../../../../shared/core/errors";
import { Result } from "../../../../../../shared/core/result";
import { uniTrafficId } from "../../../../../../shared/lib/uniTrafficId";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { VehicleFactory } from "../../../../../vehicle/src/domain/models/vehicle/factory";
import { VehicleMapper } from "../../../../../vehicle/src/domain/models/vehicle/mapper";
import type { IVehicleDTO } from "../../../../../vehicle/src/dtos/vehicleDTO";
import { ViolationFactory } from "../../../../../violation/src/domain/models/violation/factory";
import { ViolationMapper } from "../../../../../violation/src/domain/models/violation/mapper";
import type { IViolationDTO } from "../../../../../violation/src/dtos/violationDTO";
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
  createdAt?: Date;
  status?: string;
  user?: User;
  reporter?: User;
  violation?: Violation;
  vehicle?: Vehicle;
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
        vehicle: vehicleOrUndefined
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

  private static _getVehicleDTOFromPersistence(vehicle: Vehicle): IVehicleDTO {
    const vehicleDomainOrError = VehicleFactory.create(vehicle);
    if (vehicleDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting Vehicle from persistence to Domain");
    }

    return new VehicleMapper().toDTO(vehicleDomainOrError.getValue());
  }

  private static _getViolationDTOFromPersistence(violation: Violation): IViolationDTO {
    const vehicleDomainOrError = ViolationFactory.create(violation);
    if (vehicleDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting Violation from persistence to Domain");
    }

    return new ViolationMapper().toDTO(vehicleDomainOrError.getValue());
  }
}
