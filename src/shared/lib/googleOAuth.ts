import { OAuth2Client, type TokenPayload } from "google-auth-library";
import { AppError, UnauthorizedError } from "../core/errors";

/**
 * [UTE004]: Google OAuth GOOGLE_WEB_CLIENT_ID or
 * MOBILE_CLIENT_ID is not defined in environment variables.
 */

export class GoogleOAuth {
  private readonly _webClientId: string;
  private readonly _mobileClientId: string;
  private readonly _googleWebClient: OAuth2Client;
  private readonly _googleMobileClient: OAuth2Client;

  public constructor(
    webClientId: string | undefined = process.env.GOOGLE_WEB_CLIENT_ID,
    mobileClientId: string | undefined = process.env.GOOGLE_MOBILE_CLIENT_ID
  ) {
    if (!webClientId || !mobileClientId) {
      throw new AppError("[UTE004]");
    }

    this._webClientId = webClientId;
    this._mobileClientId = mobileClientId;
    this._googleWebClient = new OAuth2Client(webClientId);
    this._googleMobileClient = new OAuth2Client(mobileClientId);
  }

  public getWebClient(): OAuth2Client {
    return this._googleWebClient;
  }

  public getMobileClient(): OAuth2Client {
    return this._googleMobileClient;
  }

  public async getPayloadFromToken(token: string, client: "MOBILE" | "WEB"): Promise<TokenPayload> {
    let payload: TokenPayload | undefined;
    try {
      const googleClient = client === "MOBILE" ? this._googleMobileClient : this._googleWebClient;
      const googleClientId = client === "MOBILE" ? this._mobileClientId : this._webClientId;

      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: googleClientId
      });
      payload = ticket.getPayload();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedError("Invalid Token");
    }

    if (!payload) {
      throw new UnauthorizedError("Invalid Token Provided");
    }

    return payload;
  }
}
