import type { User, VehicleApplication } from "@prisma/client";
import { defaultTo } from "rambda";
import { UnexpectedError } from "../../../../shared/core/errors";
import { Result } from "../../../../shared/core/result";
import { uniTrafficId } from "../../../../shared/lib/uniTrafficId";
import { UserFactory } from "../../../user/src/domain/models/user/factory";
import { UserMapper } from "../../../user/src/domain/models/user/mapper";
import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import { VehicleApplicationFactory } from "../../../vehicleApplication/src/domain/models/vehicleApplication/factory";
import { VehicleApplicationMapper } from "../../../vehicleApplication/src/domain/models/vehicleApplication/mapper";
import type { IVehicleApplicationDTO } from "../../../vehicleApplication/src/dtos/vehicleApplicationDTO";
import { AmountDue } from "./classes/amountDue";
import { CashTendered } from "./classes/cashTendered";
import {
  type IVehicleApplicationPayment,
  VehicleApplicationPayment
} from "./classes/vehicleApplicationPayment";

/** TODO:
 *  Make the change optional parameter change?: number
 *  So when we are creating a new VehicleApplicationPayment
 *  change will be calculated upon creation and skip calculation
 *  if data come from db.
 */

export interface IVehicleApplicationPaymentFactoryProps {
  id?: string;
  amountDue: number;
  cashTendered: number;
  change?: number;
  totalAmountPaid?: number;
  vehicleApplicationId: string;
  cashierId: string;
  date?: Date;
  cashier?: User;
  vehicleApplication?: VehicleApplication;
}

export class VehicleApplicationPaymentFactory {
  public static create(
    props: IVehicleApplicationPaymentFactoryProps
  ): Result<IVehicleApplicationPayment> {
    const amountDueOrError = AmountDue.create(props.amountDue);
    if (amountDueOrError.isFailure) {
      return Result.fail(amountDueOrError.getErrorMessage()!);
    }

    const cashTenderedOrError = CashTendered.create(
      props.cashTendered,
      amountDueOrError.getValue()
    );
    if (cashTenderedOrError.isFailure) {
      return Result.fail(cashTenderedOrError.getErrorMessage()!);
    }

    const cashierOrUndefined = props.cashier
      ? VehicleApplicationPaymentFactory._getUserDTOFromPersistence(props.cashier)
      : undefined;

    const vehicleApplicationOrUndefined = props.vehicleApplication
      ? VehicleApplicationPaymentFactory._getVehicleApplicationDTOFromPersistence(
          props.vehicleApplication
        )
      : undefined;

    const change = props.change !== undefined ? props.change : props.cashTendered - props.amountDue;
    const totalAmountPaid =
      props.totalAmountPaid !== undefined ? props.totalAmountPaid : props.cashTendered - change;

    return Result.ok<IVehicleApplicationPayment>(
      VehicleApplicationPayment.create({
        ...props,
        id: defaultTo(uniTrafficId(), props.id),
        amountDue: amountDueOrError.getValue(),
        cashTendered: cashTenderedOrError.getValue(),
        change: change,
        totalAmountPaid: totalAmountPaid,
        date: defaultTo(new Date(), props.date),
        cashier: cashierOrUndefined,
        vehicleApplication: vehicleApplicationOrUndefined
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

  private static _getVehicleApplicationDTOFromPersistence(
    vehicleApplication: VehicleApplication
  ): IVehicleApplicationDTO {
    const vehicleApplicationDomainOrError = VehicleApplicationFactory.create(vehicleApplication);
    if (vehicleApplicationDomainOrError.isFailure) {
      throw new UnexpectedError("Error converting VehicleApplication from persistence to Domain");
    }
    return new VehicleApplicationMapper().toDTO(vehicleApplicationDomainOrError.getValue());
  }
}
