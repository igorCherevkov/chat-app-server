import { IsArray, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  otherUserLogin: string;
}

export class CreateGroupChatDto {
  @IsArray()
  @IsString({ each: true })
  otherUsersLogins: string[];
}
