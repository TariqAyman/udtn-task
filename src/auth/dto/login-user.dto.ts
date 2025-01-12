import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@udtn.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User Password',
    example: 'user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
