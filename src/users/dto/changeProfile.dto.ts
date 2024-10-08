import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ChangeProfileDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @IsOptional()
  avatar: string;
}
