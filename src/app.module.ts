import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { Chat, ChatMessage, User, UserChat } from '../db/models';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [
    UsersModule,
    ChatsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        dialect: configService.get('DB_DIALECT'),
        models: [User, Chat, UserChat, ChatMessage],
      }),
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', '..', 'uploads', 'users-avatars'),
        serveRoot: '/uploads/users-avatars/',
      },
      {
        rootPath: join(__dirname, '..', '..', 'uploads', 'message-img'),
        serveRoot: '/uploads/message-img/',
      },
    ),
  ],
})
export class AppModule {}
