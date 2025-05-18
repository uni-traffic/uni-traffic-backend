import { ViolationRecordPaymentMapper } from "../../../src/domain/models/violationRecordPayment/mapper";
import { createViolationRecordPaymentDomainObject } from "../../utils/violationRecordPayment/createViolationRecordPaymentDomainObject";
import { createViolationRecordPaymentPersistenceData } from "../../utils/violationRecordPayment/createViolationRecordPaymentPersistenceData";

describe("ViolationRecordPaymentMapper", () => {
  let violationRecordPaymentMapper: ViolationRecordPaymentMapper;

  beforeAll(() => {
    violationRecordPaymentMapper = new ViolationRecordPaymentMapper();
  });

  it("should map to domain from persistence", () => {
    const persistenceData = createViolationRecordPaymentPersistenceData({});
    const domainObject = violationRecordPaymentMapper.toDomain(persistenceData);

    expect(domainObject.id).toBe(persistenceData.id);
    expect(domainObject.cashierId).toBe(persistenceData.cashierId);
    expect(domainObject.violationRecordId).toBe(persistenceData.violationRecordId);
    expect(domainObject.amountDue.value).toBe(persistenceData.amountDue);
    expect(domainObject.cashTendered.value).toBe(persistenceData.cashTendered);
    expect(domainObject.change).toBe(persistenceData.change);
    expect(domainObject.totalAmountPaid).toBe(persistenceData.totalAmountPaid);
  });

  it("should map to persistence from domain", () => {
    const domainObject = createViolationRecordPaymentDomainObject({});
    const persistenceData = violationRecordPaymentMapper.toPersistence(domainObject);

    expect(persistenceData.id).toBe(domainObject.id);
    expect(persistenceData.cashierId).toBe(domainObject.cashierId);
    expect(persistenceData.violationRecordId).toBe(domainObject.violationRecordId);
    expect(persistenceData.amountDue).toBe(domainObject.amountDue.value);
    expect(persistenceData.cashTendered).toBe(domainObject.cashTendered.value);
    expect(persistenceData.change).toBe(domainObject.change);
    expect(persistenceData.totalAmountPaid).toBe(domainObject.totalAmountPaid);
  });

  it("should map to DTO from domain", () => {
    const domainObject = createViolationRecordPaymentDomainObject({});
    const dto = violationRecordPaymentMapper.toDTO(domainObject);

    expect(dto.id).toBe(domainObject.id);
    expect(dto.cashierId).toBe(domainObject.cashierId);
    expect(dto.violationRecordId).toBe(domainObject.violationRecordId);
    expect(dto.amountDue).toBe(domainObject.amountDue.value);
    expect(dto.cashTendered).toBe(domainObject.cashTendered.value);
    expect(dto.change).toBe(domainObject.change);
    expect(dto.totalAmountPaid).toBe(domainObject.totalAmountPaid);
  });
});
