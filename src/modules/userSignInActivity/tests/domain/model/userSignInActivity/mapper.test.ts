import { UserSignInActivityMapper } from "../../../../src/domain/models/userSignInActivity/mapper";
import { createUserSignInActivityDomainObject } from "../../../utils/createUserSignInActivityDomainObject";
import { createUserSignInActivityPersistenceData } from "../../../utils/createUserSignInActivityPersistenceData";

describe("UserSignInActivityMapper", () => {
  let mapper: UserSignInActivityMapper;

  beforeAll(() => {
    mapper = new UserSignInActivityMapper();
  });

  it("should map to domain from persistence using DTOs", () => {
    const data = createUserSignInActivityPersistenceData({});
    const domainObject = mapper.toDomain(data);

    expect(domainObject.id).toBe(data.id);
    expect(domainObject.userId).toBe(data.userId);
  });

  it("should map to persistence from domain using DTOs", () => {
    const domainObject = createUserSignInActivityDomainObject({});
    const persistenceData = mapper.toPersistence(domainObject);

    expect(persistenceData.id).toBe(domainObject.id);
    expect(persistenceData.userId).toBe(domainObject.userId);
  });

  it("should map to DTO from domain using DTOs", () => {
    const domainObject = createUserSignInActivityDomainObject({});
    const dto = mapper.toDTO(domainObject);

    expect(dto.id).toBe(domainObject.id);
    expect(dto.userId).toBe(domainObject.userId);
  });
});
