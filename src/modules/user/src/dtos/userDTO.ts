export interface IUserDTO {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface IUserLoginResponse {
  user: IUserDTO;
  appKey: string;
  accessToken: string;
}

export interface GetUserByPropertyUseCasePayload {
  id?: string;
  lastName?: string;
  firstName?: string;
  username?: string;
  email?: string;
  role?: string;
  count: number;
  page: number;
}
