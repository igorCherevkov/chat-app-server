import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { UsersService } from './users.service';
import { ChangeProfileDto } from './dto/changeProfile.dto';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesDecorator, RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './types/types';
import { User } from 'db/models';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/users-avatars',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}${file.originalname.replaceAll(' ', '')}`;
          cb(null, filename);
        },
      }),
    }),
  )
  changeProfile(
    @Body() changeProfile: ChangeProfileDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<User> {
    const filename = file ? file.filename : null;
    return this.usersService.changeProfile(changeProfile, id, filename);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.admin)
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
