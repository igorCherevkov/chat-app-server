import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class registrationDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
