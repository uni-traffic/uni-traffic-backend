import { faker } from "@faker-js/faker";
import { VehicleApplicationSchoolMember } from "../../../../../src/domain/models/vehicleApplication/classes/vehicleApplicationSchoolMember";

describe("VehicleApplicationSchoolMember", () => {
  it("should create a valid 'STUDENT' school member", () => {
    const validProps = {
      schoolId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      type: "STUDENT",
      schoolCredential: faker.image.url()
    };

    const schoolMemberOrFailure = VehicleApplicationSchoolMember.create(validProps);

    expect(schoolMemberOrFailure.isSuccess).toBe(true);
    expect(schoolMemberOrFailure.getValue()).toBeInstanceOf(VehicleApplicationSchoolMember);
    expect(schoolMemberOrFailure.getValue().firstName).toBe(validProps.firstName);
    expect(schoolMemberOrFailure.getValue().type).toBe(validProps.type);
    expect(schoolMemberOrFailure.getValue().schoolId).toBe(validProps.schoolId);
  });

  it("should create a valid 'STAFF' school member", () => {
    const validProps = {
      schoolId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      type: "STAFF",
      schoolCredential: faker.image.url()
    };

    const schoolMemberOrFailure = VehicleApplicationSchoolMember.create(validProps);

    expect(schoolMemberOrFailure.isSuccess).toBe(true);
    expect(schoolMemberOrFailure.getValue()).toBeInstanceOf(VehicleApplicationSchoolMember);
    expect(schoolMemberOrFailure.getValue().firstName).toBe(validProps.firstName);
    expect(schoolMemberOrFailure.getValue().type).toBe(validProps.type);
    expect(schoolMemberOrFailure.getValue().schoolId).toBe(validProps.schoolId);
  });

  it("should not create a school member with an invalid type", () => {
    const invalidProps = {
      schoolId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      type: "ALUMNI",
      schoolCredential: faker.image.url()
    };

    const schoolMemberOrFailure = VehicleApplicationSchoolMember.create(invalidProps);

    expect(schoolMemberOrFailure.isSuccess).toBe(false);
    expect(schoolMemberOrFailure.getErrorMessage()).toContain(
      "Invalid School Member type. Valid types are STUDENT, STAFF"
    );
  });

  it("should not create a school member with an empty type", () => {
    const invalidProps = {
      schoolId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      type: "",
      schoolCredential: faker.image.url()
    };

    const schoolMemberOrFailure = VehicleApplicationSchoolMember.create(invalidProps);

    expect(schoolMemberOrFailure.isSuccess).toBe(false);
    expect(schoolMemberOrFailure.getErrorMessage()).toContain(
      "Invalid School Member type. Valid types are STUDENT, STAFF"
    );
  });

  it("should not create a school member with a mixed case type", () => {
    const invalidProps = {
      schoolId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      type: "student",
      schoolCredential: faker.image.url()
    };

    const schoolMemberOrFailure = VehicleApplicationSchoolMember.create(invalidProps);

    expect(schoolMemberOrFailure.isSuccess).toBe(false);
    expect(schoolMemberOrFailure.getErrorMessage()).toContain(
      "Invalid School Member type. Valid types are STUDENT, STAFF"
    );
  });
});
