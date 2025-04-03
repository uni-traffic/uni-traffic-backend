import { BadRequest, NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import type { IVehicleApplication } from "../../../vehicleApplication/src/domain/models/vehicleApplication/classes/vehicleApplication";
import { VehicleApplicationStatus } from "../../../vehicleApplication/src/domain/models/vehicleApplication/classes/vehicleApplicationStatus";
import type { IVehicleApplicationDTO } from "../../../vehicleApplication/src/dtos/vehicleApplicationDTO";
import {
  type IVehicleApplicationRepository,
  VehicleApplicationRepository
} from "../../../vehicleApplication/src/repositories/vehicleApplicationRepository";
import {
  type IVehicleApplicationService,
  VehicleApplicationService
} from "../../../vehicleApplication/src/shared/service/updateStatusService";
import type { IVehicleApplicationPayment } from "../domain/classes/vehicleApplicationPayment";
import { VehicleApplicationPaymentFactory } from "../domain/factory";
import {
  type IVehicleApplicationPaymentMapper,
  VehicleApplicationPaymentMapper
} from "../domain/mapper";
import type { IVehicleApplicationPaymentDTO } from "../dtos/vehicleApplicationPaymentDTO";
import type { VehicleApplicationPaymentRequest } from "../dtos/vehicleApplicationPaymentRequestSchema";
import {
  type IVehicleApplicationPaymentRepository,
  VehicleApplicationPaymentRepository
} from "../repositories/vehicleApplicationPaymentRepositories";

export class AddVehicleApplicationPaymentUseCase {
  private _vehicleApplicationRepository: IVehicleApplicationRepository;
  private _vehicleApplicationPaymentRepository: IVehicleApplicationPaymentRepository;
  private _vehicleApplicationService: IVehicleApplicationService;
  private _vehicleApplicationPaymentMapper: IVehicleApplicationPaymentMapper;

  public constructor(
    vehicleApplicationRepository: IVehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationPaymentRepository: IVehicleApplicationPaymentRepository = new VehicleApplicationPaymentRepository(),
    vehicleApplicationService: IVehicleApplicationService = new VehicleApplicationService(),
    vehicleApplicationPaymentMapper: IVehicleApplicationPaymentMapper = new VehicleApplicationPaymentMapper()
  ) {
    this._vehicleApplicationRepository = vehicleApplicationRepository;
    this._vehicleApplicationPaymentRepository = vehicleApplicationPaymentRepository;
    this._vehicleApplicationService = vehicleApplicationService;
    this._vehicleApplicationPaymentMapper = vehicleApplicationPaymentMapper;
  }

  public async execute(
    request: VehicleApplicationPaymentRequest,
    cashierId: string
  ): Promise<IVehicleApplicationPaymentDTO> {
    const vehicleApplication = await this._getVehicleApplicationOrThrow(
      request.vehicleApplicationId
    );

    this._validateCashTendered(request.cashTendered, request.amountDue);
    this._checkVehicleApplicationForPayment(vehicleApplication);

    const payment = this._createPayment(request, cashierId);
    const newPayment = await this._savePayment(payment);

    await this._updateVehicleApplicationStatus(vehicleApplication);

    return this._vehicleApplicationPaymentMapper.toDTO(newPayment);
  }

  private async _getVehicleApplicationOrThrow(
    vehicleApplicationId: string
  ): Promise<IVehicleApplication> {
    const vehicleApplication =
      await this._vehicleApplicationRepository.getVehicleApplicationByProperty({
        id: vehicleApplicationId,
        count: 1,
        page: 1
      });

    if (!vehicleApplication.length) {
      throw new NotFoundError("Vehicle Application not found.");
    }

    return vehicleApplication[0];
  }

  private _checkVehicleApplicationForPayment(vehicleApplication: IVehicleApplication): void {
    if (vehicleApplication.status.value !== "PENDING_FOR_PAYMENT") {
      throw new BadRequest(
        "Payment can be only be processed for application with status PENDING_FOR_PAYMENT"
      );
    }
  }

  private _validateCashTendered(cashTendered: number, amountDue: number) {
    if (cashTendered < amountDue) {
      throw new BadRequest("Cash tendered is less than the required amount due.");
    }
  }

  private _createPayment(request: VehicleApplicationPaymentRequest, cashierId: string) {
    const paymentResult = VehicleApplicationPaymentFactory.create({
      vehicleApplicationId: request.vehicleApplicationId,
      amountDue: request.amountDue,
      cashTendered: request.cashTendered,
      change: request.cashTendered - request.amountDue,
      totalAmountPaid: request.cashTendered,
      cashierId
    });

    if (paymentResult.isFailure) {
      throw new BadRequest("Failed to create payment record");
    }

    return paymentResult.getValue();
  }

  private async _savePayment(
    payment: IVehicleApplicationPayment
  ): Promise<IVehicleApplicationPayment> {
    const savedPayment = await this._vehicleApplicationPaymentRepository.createPayment(payment);

    if (!savedPayment) {
      throw new BadRequest("Failed to process payment");
    }

    return savedPayment;
  }

  private async _updateVehicleApplicationStatus(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplicationDTO> {
    const updateStatusResult = VehicleApplicationStatus.create("PENDING_FOR_STICKER");

    if (updateStatusResult.isFailure) {
      throw new UnexpectedError("Failed to update vehicle application status.");
    }

    const newStatus = updateStatusResult.getValue();
    const toUpdateStatus = await this._vehicleApplicationService.updateStatus({
      vehicleApplicationId: vehicleApplication.id,
      status: newStatus.value
    });

    if (!toUpdateStatus) {
      throw new BadRequest("Failed to update vehicle application status.");
    }

    return toUpdateStatus;
  }
}
