export interface IViolationDTO {
  id: string;
  category: string;
  violationName: string;
  penalty: number;
  isDeleted: boolean;
}

export interface ViolationWhereClauseParams {
  id?: string;
  category?: string;
  violationName?: string;
  isDeleted?: boolean;
  searchKey?: string;
}

export type GetViolation = {
  id?: string;
  category?: string;
  violationName?: string;
  isDeleted?: boolean;
  searchKey?: string;
  count: number;
  page: number;
  sort?: 1 | 2;
};

export interface GetViolationResponse {
  violation: IViolationDTO[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}
