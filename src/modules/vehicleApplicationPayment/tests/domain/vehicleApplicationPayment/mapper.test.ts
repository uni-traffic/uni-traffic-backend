import { VehicleApplicationPaymentMapper } from "../../../src/domain/mapper";
import { createVehicleApplicationPaymentDomainObject } from "../../utils/createVehicleApplicationPaymentDomainObject";
import { createVehicleApplicationPaymentPersistenceData } from "../../utils/createVehicleApplicationPaymentPersistenceData";

describe("VehicleApplicationPaymentMapper", () => {
  let vehicleApplicationPaymentMapper: VehicleApplicationPaymentMapper;

  beforeAll(() => {
    vehicleApplicationPaymentMapper = new VehicleApplicationPaymentMapper();
  });

  it("should map to domain from persistence", () => {
    const persistenceData = createVehicleApplicationPaymentPersistenceData({});
    const domainObject = vehicleApplicationPaymentMapper.toDomain(persistenceData);

    expect(domainObject.id).toBe(persistenceData.id);
    expect(domainObject.cashierId).toBe(persistenceData.cashierId);
    expect(domainObject.vehicleApplicationId).toBe(persistenceData.vehicleApplicationId);
    expect(domainObject.amountDue.value).toBe(persistenceData.amountDue);
    expect(domainObject.cashTendered.value).toBe(persistenceData.cashTendered);
    expect(domainObject.change).toBe(persistenceData.change);
    expect(domainObject.totalAmountPaid).toBe(persistenceData.totalAmountPaid);
  });

  it("should map to persistence from domain", () => {
    const domainObject = createVehicleApplicationPaymentDomainObject({});
    const persistenceData = vehicleApplicationPaymentMapper.toPersistence(domainObject);

    expect(persistenceData.id).toBe(domainObject.id);
    expect(persistenceData.cashierId).toBe(domainObject.cashierId);
    expect(persistenceData.vehicleApplicationId).toBe(domainObject.vehicleApplicationId);
    expect(persistenceData.amountDue).toBe(domainObject.amountDue.value);
    expect(persistenceData.cashTendered).toBe(domainObject.cashTendered.value);
    expect(persistenceData.change).toBe(domainObject.change);
    expect(persistenceData.totalAmountPaid).toBe(domainObject.totalAmountPaid);
  });

  it("should map to DTO from domain", () => {
    const domainObject = createVehicleApplicationPaymentDomainObject({});
    const dto = vehicleApplicationPaymentMapper.toDTO(domainObject);

    expect(dto.id).toBe(domainObject.id);
    expect(dto.cashierId).toBe(domainObject.cashierId);
    expect(dto.vehicleApplicationId).toBe(domainObject.vehicleApplicationId);
    expect(dto.amountDue).toBe(domainObject.amountDue.value);
    expect(dto.cashTendered).toBe(domainObject.cashTendered.value);
    expect(dto.change).toBe(domainObject.change);
    expect(dto.totalAmountPaid).toBe(domainObject.totalAmountPaid);
  });
});
