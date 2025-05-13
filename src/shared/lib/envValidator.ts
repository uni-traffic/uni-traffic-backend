export class EnvValidator {
  private requiredKeysWithCodes: { key: string; code: string }[];

  public constructor() {
    this.requiredKeysWithCodes = [
      { key: "NODE_ENV", code: "[UTE001]" },
      { key: "JWT_SECRET", code: "[UTE002]" },
      { key: "COOKIE_SECRET", code: "[UTE003]" },
      { key: "JWT_EXPIRATION", code: "[UTE004]" },
      { key: "PLATE_RECOGNIZER_KEY", code: "[UTE005]" },
      { key: "DATABASE_URL", code: "[UTE006]" },
      { key: "GOOGLE_MOBILE_CLIENT_ID", code: "[UTE007]" },
      { key: "GOOGLE_WEB_CLIENT_ID", code: "[UTE008]" },
      { key: "ALLOWED_ORIGIN", code: "[UTE009]" },
      { key: "SUPABASE_URL", code: "[UTE010]" },
      { key: "SUPABASE_KEY", code: "[UTE011]" },
      { key: "SUPABASE_BUCKET_NAME", code: "[UTE012]" },
      { key: "SUPABASE_IMAGE_PLACEHOLDER", code: "[UTE013]" },
      { key: "SYSTEM_KEY", code: "[UTE014]" }
    ];
  }

  public validate(): string[] {
    return this.requiredKeysWithCodes
      .filter(({ key }) => !process.env[key])
      .map(({ code }) => code);
  }
}
