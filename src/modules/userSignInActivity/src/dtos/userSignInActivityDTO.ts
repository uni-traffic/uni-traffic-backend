import type { IUserDTO } from "../../../user/src/dtos/userDTO";

export interface IUserSignInActivityDTO {
  id: string;
  userId: string;
  time: Date;
  user?: IUserDTO | null; 
}