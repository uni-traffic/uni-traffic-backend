import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import type { IVehicleApplication } from "../../../vehicleApplication/src/domain/models/vehicleApplication/classes/vehicleApplication";
import { VehicleApplicationStatus } from "../../../vehicleApplication/src/domain/models/vehicleApplication/classes/vehicleApplicationStatus";
import { VehicleApplicationRepository } from "../../../vehicleApplication/src/repositories/vehicleApplicationRepository";
import { VehicleApplicationService } from "../../../vehicleApplication/src/shared/service/updateStatusService";
import type { IVehicleApplicationPayment } from "../domain/classes/vehicleApplicationPayment";
import { VehicleApplicationPaymentFactory } from "../domain/factory";
import { VehicleApplicationPaymentMapper } from "../domain/mapper";
import type { IVehicleApplicationPaymentDTO } from "../dtos/vehicleApplicationPaymentDTO";
import type { VehicleApplicationPaymentRequest } from "../dtos/vehicleApplicationPaymentRequestSchema";
import { VehicleApplicationPaymentRepository } from "../repositories/vehicleApplicationPaymentRepositories";

export class AddVehicleApplicationPaymentUseCase {
  private _vehicleApplicationRepository: VehicleApplicationRepository;
  private _vehicleApplicationPaymentRepository: VehicleApplicationPaymentRepository;
  private _vehicleApplicationService: VehicleApplicationService;
  private _vehicleApplicationPaymentMapper: VehicleApplicationPaymentMapper;

  public constructor(
    vehicleApplicationRepository: VehicleApplicationRepository = new VehicleApplicationRepository(),
    vehicleApplicationPaymentRepository: VehicleApplicationPaymentRepository = new VehicleApplicationPaymentRepository(),
    vehicleApplicationService: VehicleApplicationService = new VehicleApplicationService(),
    vehicleApplicationPaymentMapper: VehicleApplicationPaymentMapper = new VehicleApplicationPaymentMapper()
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
    const vehicleApplication = await this.getVehicleApplicationOrThrow(
      request.vehicleApplicationId
    );

    this.validateCashTendered(request.cashTendered, request.amountDue);
    this.checkVehicleApplicationForPayment(vehicleApplication);

    const payment = this.createPayment(request, cashierId);
    const newPayment = await this.savePayment(payment);

    await this.updateVehicleApplicationStatus(vehicleApplication);

    return this._vehicleApplicationPaymentMapper.toDTO(newPayment);
  }

  private async getVehicleApplicationOrThrow(
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

  private checkVehicleApplicationForPayment(vehicleApplication: IVehicleApplication): void {
    if (vehicleApplication.status.value !== "PENDING_FOR_PAYMENT") {
      throw new BadRequest(
        "Payment can be only be processed for application with status PENDING_FOR_PAYMENT"
      );
    }
  }

  private validateCashTendered(cashTendered: number, amountDue: number) {
    if (cashTendered < amountDue) {
      throw new BadRequest("Cash tendered is less than the required amount due.");
    }
  }

  private createPayment(request: VehicleApplicationPaymentRequest, cashierId: string) {
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

  private async savePayment(
    payment: IVehicleApplicationPayment
  ): Promise<IVehicleApplicationPayment> {
    const savedPayment = await this._vehicleApplicationPaymentRepository.createPayment(payment);

    if (!savedPayment) {
      throw new BadRequest("Failed to process payment");
    }

    return savedPayment;
  }

  private async updateVehicleApplicationStatus(
    vehicleApplication: IVehicleApplication
  ): Promise<IVehicleApplication> {
    const updateStatusResult = VehicleApplicationStatus.create("PENDING_FOR_STICKER");
    const newStatus = updateStatusResult.getValue();

    if (updateStatusResult.isFailure) {
      throw new BadRequest("Failed to update vehicle application status.");
    }

    return await this._vehicleApplicationService.updateStatus({
      vehicleApplicationId: vehicleApplication.id,
      status: newStatus.value
    });
  }
}
