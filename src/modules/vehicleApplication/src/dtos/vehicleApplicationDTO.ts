import type { IUserDTO } from "../../../user/src/dtos/userDTO";
import type { IVehicleApplicationPaymentDTO } from "../../../vehicleApplicationPayment/src/dtos/vehicleApplicationPaymentDTO";

export interface IVehicleApplicationDTO {
  id: string;
  stickerNumber: string | null;
  remarks: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  schoolMember: {
    schoolId: string;
    firstName: string;
    lastName: string;
    type: string;
    schoolCredential: string;
  };
  driver: {
    firstName: string;
    lastName: string;
    licenseId: string;
    licenseImage: string;
  };
  vehicle: {
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
  };
  status: string;
  applicantId: string;
  applicant?: IUserDTO;
  payment?: IVehicleApplicationPaymentDTO;
  /**
   * TODO: ADD AUDIT LOG
   */
}

export type GetViolationVehicle = {
  id?: string;
  schoolId?: string;
  userType?: string;
  driverLicenseId?: string;
  driverLastName?: string;
  driverFirstName?: string;
  firstName?: string;
  lastName?: string;
  licensePlate?: string;
  status?: string;
  applicantId?: string;
  count: number;
  page: number;
  sort?: 1 | 2;
  searchKey?: string;
};

export interface IVehicleApplicationLinks {
  schoolCredential: string;
  licenseImage: string;
  certificateOfRegistration: string;
  officialReceipt: string;
  frontImage: string;
  sideImage: string;
  backImage: string;
}

export interface IUpdateVehicleApplicationProps {
  vehicleApplicationId: string;
  status: string;
  actorId: string;
}

export interface VehicleApplicationWhereClauseParams {
  id?: string;
  applicantId?: string;
  driverLastName?: string;
  driverFirstName?: string;
  firstName?: string;
  lastName?: string;
  schoolId?: string;
  userType?: string;
  status?: string;
  searchKey?: string;
}

export interface GetVehicleApplicationResponse {
  vehicleApplication: IVehicleApplicationDTO[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}

export type VehicleApplicationCountByStatus = { status: string; count: number }[];
