export class Driver {
  private readonly _lastName: string | null;
  private readonly _firstName: string | null;
  private readonly _licenseId: string | null;
  private readonly _licenseImage: string | null;
  private readonly _selfiePicture: string | null;

  public constructor(data: {
    lastName?: string | null;
    firstName?: string | null;
    licenseId?: string | null;
    licenseImage?: string | null;
    selfiePicture?: string | null;
  }) {
    this._lastName = data.lastName ?? null;
    this._firstName = data.firstName ?? null;
    this._licenseId = data.licenseId ?? null;
    this._licenseImage = data.licenseImage ?? null;
    this._selfiePicture = data.selfiePicture ?? null;
  }

  public get lastName(): string | null {
    return this._lastName;
  }

  public get firstName(): string | null {
    return this._firstName;
  }

  public get licenseId(): string | null {
    return this._licenseId;
  }

  public get licenseImage(): string | null {
    return this._licenseImage;
  }

  public get selfiePicture(): string | null {
    return this._selfiePicture;
  }

  public toJSON() {
    return {
      lastName: this._lastName,
      firstName: this._firstName,
      licenseId: this._licenseId,
      licenseImage: this._licenseImage,
      selfiePicture: this._selfiePicture
    };
  }
}
