export class VehicleImages {
  private readonly _front: string | null;
  private readonly _side: string | null;
  private readonly _back: string | null;
  private readonly _receipt: string | null;
  private readonly _registration: string | null;

  public constructor(data: {
    front?: string | null;
    side?: string | null;
    back?: string | null;
    receipt?: string | null;
    registration?: string | null;
  }) {
    this._back = data.back ?? null;
    this._side = data.side ?? null;
    this._front = data.front ?? null;
    this._receipt = data.receipt ?? null;
    this._registration = data.registration ?? null;
  }

  public get front(): string | null {
    return this._front;
  }

  public get side(): string | null {
    return this._side;
  }

  public get back(): string | null {
    return this._back;
  }

  public get receipt(): string | null {
    return this._receipt;
  }

  public get registration(): string | null {
    return this._registration;
  }

  public toJSON() {
    return {
      front: this._front,
      side: this._side,
      back: this._back,
      receipt: this._receipt,
      registration: this._registration
    };
  }
}
