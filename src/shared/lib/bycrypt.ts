import bycrypt from "bcryptjs";

export interface IHashAlgorithm {
  generateHash(rawPassword: string): Promise<string>;
  verifyHash(rawPassword: string, hashedPassword: string): Promise<boolean>;
}

export class BycryptPassword implements IHashAlgorithm {
  private _SALT_ROUNDS = 12;

  public generateHash(rawPassword: string): Promise<string> {
    return bycrypt.hash(rawPassword, this._SALT_ROUNDS);
  }

  public verifyHash(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return bycrypt.compare(rawPassword, hashedPassword);
  }
}
