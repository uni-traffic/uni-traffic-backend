export class SchoolMember {
  private readonly _schoolId: string | null;
  private readonly _lastName: string | null;
  private readonly _firstName: string | null;
  private readonly _type: string | null;
  private readonly _schoolCredential: string | null;

  public constructor(data: {
    schoolId?: string | null;
    lastName?: string | null;
    firstName?: string | null;
    type?: string | null;
    schoolCredential?: string | null;
  }) {
    this._schoolId = data.schoolId ?? null;
    this._lastName = data.lastName ?? null;
    this._firstName = data.firstName ?? null;
    this._type = data.type ?? null;
    this._schoolCredential = data.schoolCredential ?? null;
  }

  public get schoolId(): string | null {
    return this._schoolId;
  }

  public get lastName(): string | null {
    return this._lastName;
  }

  public get firstName(): string | null {
    return this._firstName;
  }

  public get type(): string | null {
    return this._type;
  }

  public get schoolCredential(): string | null {
    return this._schoolCredential;
  }

  public toJSON() {
    return {
      schoolId: this._schoolId,
      lastName: this._lastName,
      firstName: this._firstName,
      type: this._type,
      schoolCredential: this._schoolCredential
    };
  }
}
