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

    this._ensureCashTenderedIsNotLessThanAmountDue(request.cashTendered, request.amountDue);
    this._ensureVehicleApplicationIsPendingForPayment(vehicleApplication);

    const newPayment = this._createPayment(request, cashierId);
    const savedPayment = await this._savePayment(newPayment);

    await this._updateVehicleApplicationStatus(vehicleApplication);

    return this._vehicleApplicationPaymentMapper.toDTO(savedPayment);
  }

  private async _getVehicleApplicationOrThrow(
    vehicleApplicationId: string
  ): Promise<IVehicleApplication> {
    const vehicleApplication =
      await this._vehicleApplicationRepository.getVehicleApplicationById(vehicleApplicationId);
    if (!vehicleApplication) {
      throw new NotFoundError("Vehicle Application not found.");
    }

    return vehicleApplication;
  }

  private _ensureVehicleApplicationIsPendingForPayment(
    vehicleApplication: IVehicleApplication
  ): void {
    if (vehicleApplication.status.value !== "PENDING_FOR_PAYMENT") {
      throw new BadRequest(
        "Payment can be only be processed for application with status PENDING_FOR_PAYMENT"
      );
    }
  }

  private _ensureCashTenderedIsNotLessThanAmountDue(cashTendered: number, amountDue: number) {
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
    const newStatus = VehicleApplicationStatus.create("PENDING_FOR_STICKER");
    if (newStatus.isFailure) {
      throw new UnexpectedError("Failed to update vehicle application status.");
    }

    const updatedVehicleApplication = await this._vehicleApplicationService.updateStatus({
      vehicleApplicationId: vehicleApplication.id,
      status: newStatus.getValue().value
    });
    if (!updatedVehicleApplication) {
      throw new BadRequest("Failed to update vehicle application status.");
    }

    return updatedVehicleApplication;
  }
}
