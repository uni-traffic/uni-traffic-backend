import { Result } from "../../../../../../../shared/core/result";

export class VehicleApplicationSchoolMember {
  private readonly _schoolId: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _type: string;
  private readonly _schoolCredential: string;
  public static readonly validTypes = ["STUDENT", "STAFF"];

  private constructor(props: {
    schoolId: string;
    firstName: string;
    lastName: string;
    type: string;
    schoolCredential: string;
  }) {
    this._schoolId = props.schoolId;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._schoolCredential = props.schoolCredential;
    this._type = props.type;
  }

  public static create(props: {
    schoolId: string;
    firstName: string;
    lastName: string;
    type: string;
    schoolCredential: string;
  }): Result<VehicleApplicationSchoolMember> {
    if (!VehicleApplicationSchoolMember.validTypes.includes(props.type)) {
      return Result.fail(
        `Invalid School Member type. Valid types are ${VehicleApplicationSchoolMember.validTypes.join(", ")}`
      );
    }

    return Result.ok(new VehicleApplicationSchoolMember(props));
  }

  get schoolId(): string {
    return this._schoolId;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get type(): string {
    return this._type;
  }

  get schoolCredential(): string {
    return this._schoolCredential;
  }
}
