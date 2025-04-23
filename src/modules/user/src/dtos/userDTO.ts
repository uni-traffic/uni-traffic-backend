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

export interface GetUserUseCasePayload {
  id?: string;
  lastName?: string;
  firstName?: string;
  username?: string;
  email?: string;
  role?: string;
  sort?: 1 | 2;
  searchKey?: string;
  count: number;
  page: number;
}

export interface UserWhereClauseParams {
  id?: string;
  lastName?: string;
  firstName?: string;
  userName?: string;
  email?: string;
  role?: string;
  searchKey?: string;
}

export interface GetUserResponse {
  user: IUserDTO[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}
