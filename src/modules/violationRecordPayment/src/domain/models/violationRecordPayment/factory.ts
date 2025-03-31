import type { User, ViolationRecord } from "@prisma/client";
import { defaultTo } from "rambda";
import { UnexpectedError } from "../../../../../../shared/core/errors";
import { Result } from "../../../../../../shared/core/result";
import { uniTrafficId } from "../../../../../../shared/lib/uniTrafficId";
import { UserFactory } from "../../../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../../../user/src/domain/models/user/mapper";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { ViolationRecordFactory } from "../../../../../violationRecord/src/domain/models/violationRecord/factory";
import { ViolationRecordMapper } from "../../../../../violationRecord/src/domain/models/violationRecord/mapper";
import type { IViolationRecordDTO } from "../../../../../violationRecord/src/dtos/violationRecordDTO";
import {
  type IViolationRecordPayment,
  ViolationRecordPayment
} from "./classes/violationRecordPayment";
import { ViolationRecordPaymentRemarks } from "./classes/violationRecordPaymentRemarks";

/** TODO:
 * 1. Merge in single Payment object (Optional).
 * 2. Add cashTendered and change.
 */

export interface IViolationRecordPaymentFactoryProps {
  id?: string;
  cashierId: string;
  violationRecordId: string;
  amountPaid: number;
  remarks?: string | null;
  timePaid?: Date;
  cashier?: User;
  violationRecord?: ViolationRecord;
}

export class ViolationRecordPaymentFactory {
  public static create(
    props: IViolationRecordPaymentFactoryProps
  ): Result<IViolationRecordPayment> {
    const violationRecordPaymentRemarksOrError = ViolationRecordPaymentRemarks.create(
      defaultTo("", props.remarks ?? "")
    );
    if (violationRecordPaymentRemarksOrError.isFailure) {
      return Result.fail(violationRecordPaymentRemarksOrError.getErrorMessage()!);
    }

    const cashierOrUndefined = props.cashier
      ? ViolationRecordPaymentFactory._getUserDTOFromPersistence(props.cashier)
      : undefined;

    const violationRecordOrUndefined = props.violationRecord
      ? ViolationRecordPaymentFactory._getViolationRecordDTOFromPersistence(props.violationRecord)
      : undefined;

    return Result.ok<IViolationRecordPayment>(
      ViolationRecordPayment.create({
        ...props,
        id: defaultTo(uniTrafficId(), props.id),
        remarks: violationRecordPaymentRemarksOrError.getValue(),
        timePaid: defaultTo(new Date(), props.timePaid),
        cashier: cashierOrUndefined,
        violationRecord: violationRecordOrUndefined
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

  private static _getViolationRecordDTOFromPersistence(
    violationRecord: ViolationRecord
  ): IViolationRecordDTO {
    const violationRecordDomainOrError = ViolationRecordFactory.create(violationRecord);
    if (violationRecordDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting ViolationRecord from persistence to Domain");
    }

    return new ViolationRecordMapper().toDTO(violationRecordDomainOrError.getValue());
  }
}
