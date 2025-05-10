import {IsEmail, IsOptional, IsString} from 'class-validator';

export class LoginDto {
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}

export class SignupDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
