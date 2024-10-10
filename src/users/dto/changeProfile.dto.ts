import { IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class ChangeProfileDto {
  @IsString()
  @IsOptional()
  oldPassword: string;

  @IsString()
  @IsOptional()
  @ValidateIf(
    (obj) =>
      obj.newPassword !== undefined &&
      obj.newPassword !== null &&
      obj.newPassword !== '',
  )
  @MinLength(6)
  newPassword: string;

  @IsOptional()
  avatar: string;
}
