import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from './auth/auth.module';
import { User } from '../../db/models';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [forwardRef(() => AuthModule), SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
