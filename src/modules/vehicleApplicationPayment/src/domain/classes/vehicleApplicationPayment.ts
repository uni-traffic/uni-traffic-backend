import type { IUserDTO } from "../../../../user/src/dtos/userDTO";
import type { IVehicleApplicationDTO } from "../../../../vehicleApplication/src/dtos/vehicleApplicationDTO";
import type { AmountDue } from "./amountDue";
import type { CashTendered } from "./cashTendered";

export interface IVehicleApplicationPayment {
  id: string;
  amountDue: AmountDue;
  cashTendered: CashTendered;
  change: number;
  totalAmountPaid: number;
  vehicleApplicationId: string;
  cashierId: string;
  date: Date;
  cashier: IUserDTO | undefined;
  vehicleApplication: IVehicleApplicationDTO | undefined;
}

export class VehicleApplicationPayment implements IVehicleApplicationPayment {
  private readonly _id: string;
  private readonly _amountDue: AmountDue;
  private readonly _cashTendered: CashTendered;
  private readonly _change: number;
  private readonly _totalAmountPaid: number;
  private readonly _vehicleApplicationId: string;
  private readonly _cashierId: string;
  private readonly _date: Date;
  private readonly _cashier: IUserDTO | undefined;
  private readonly _vehicleApplication: IVehicleApplicationDTO | undefined;

  private constructor({
    id,
    amountDue,
    cashTendered,
    change,
    totalAmountPaid,
    vehicleApplicationId,
    cashierId,
    date,
    cashier,
    vehicleApplication
  }: IVehicleApplicationPayment) {
    this._id = id;
    this._amountDue = amountDue;
    this._cashTendered = cashTendered;
    this._change = change;
    this._totalAmountPaid = totalAmountPaid;
    this._vehicleApplicationId = vehicleApplicationId;
    this._cashierId = cashierId;
    this._date = date;
    this._cashier = cashier;
    this._vehicleApplication = vehicleApplication;
  }

  get id(): string {
    return this._id;
  }

  get amountDue(): AmountDue {
    return this._amountDue;
  }

  get cashTendered(): CashTendered {
    return this._cashTendered;
  }

  get change(): number {
    return this._change;
  }

  get totalAmountPaid(): number {
    return this._totalAmountPaid;
  }

  get vehicleApplicationId(): string {
    return this._vehicleApplicationId;
  }

  get cashierId(): string {
    return this._cashierId;
  }

  get date(): Date {
    return this._date;
  }

  get cashier(): IUserDTO | undefined {
    return this._cashier;
  }

  get vehicleApplication(): IVehicleApplicationDTO | undefined {
    return this._vehicleApplication;
  }

  public static create(props: IVehicleApplicationPayment): VehicleApplicationPayment {
    return new VehicleApplicationPayment(props);
  }
}
