import { AppError } from "../core/errors";

/**
 * [UTE003] PLATE_RECOGNIZER_KEY is not defined in environment variables
 */

export interface IAppKeys {
  plateRecognizerKey: string;
}

export class AppKeys implements IAppKeys {
  private readonly PLATE_RECOGNIZER_KEY: string | undefined;

  public constructor(plateRecognizerKey = process.env.PLATE_RECOGNIZER_KEY) {
    this.PLATE_RECOGNIZER_KEY = plateRecognizerKey;
  }

  public get plateRecognizerKey(): string {
    const appKey = this.PLATE_RECOGNIZER_KEY;
    if (!appKey) {
      throw new AppError("[UTE003] Key not defined");
    }

    return appKey;
  }
}
