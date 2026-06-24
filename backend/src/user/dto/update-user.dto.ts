import { Role, UserStatus } from '@prisma/client';

export class UpdateUserDto {
  username?: string;
  email?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  phone?: string | null;
  role?: Role;
  status?: UserStatus;
}
