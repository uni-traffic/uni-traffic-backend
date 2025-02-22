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
