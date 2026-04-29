import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;

  @Exclude()
  password!: string;

  @Exclude()
  refreshToken?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
