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
    expect(domainObject.amountPaid).toBe(persistenceData.amountPaid);
    expect(domainObject.remarks?.value).toBe(persistenceData.remarks);
  });

  it("should map to persistence from domain", () => {
    const domainObject = createViolationRecordPaymentDomainObject({});
    const persistenceData = violationRecordPaymentMapper.toPersistence(domainObject);

    expect(persistenceData.id).toBe(domainObject.id);
    expect(persistenceData.cashierId).toBe(domainObject.cashierId);
    expect(persistenceData.violationRecordId).toBe(domainObject.violationRecordId);
    expect(persistenceData.amountPaid).toBe(domainObject.amountPaid);
    expect(persistenceData.remarks).toBe(domainObject.remarks?.value);
  });

  it("should map to DTO from domain", () => {
    const domainObject = createViolationRecordPaymentDomainObject({});
    const dto = violationRecordPaymentMapper.toDTO(domainObject);

    expect(dto.id).toBe(domainObject.id);
    expect(dto.cashierId).toBe(domainObject.cashierId);
    expect(dto.violationRecordId).toBe(domainObject.violationRecordId);
    expect(dto.amountPaid).toBe(domainObject.amountPaid);
    expect(dto.remarks).toBe(domainObject.remarks?.value);
  });
});
