import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { IVehicleApplicationDTO } from "../../../vehicleApplication/src/dtos/vehicleApplicationDTO";

export interface IVehicleApplicationPaymentDTO {
  id: string;

  amountDue: number;
  cashTendered: number;
  change: number;
  totalAmountPaid: number;

  date: Date;

  cashierId: string;
  cashier: IUserDTO | null;

  vehicleApplicationId: string;
  vehicleApplication: IVehicleApplicationDTO | null;
}
