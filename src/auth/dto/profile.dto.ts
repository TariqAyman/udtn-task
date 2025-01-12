import { User, UserRole } from '../entities/user.entity';

export class ProfileDto {
  id: number;
  email: string;
  role: UserRole;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role as UserRole;
  }
}
