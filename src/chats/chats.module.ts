import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Chat, ChatMessage, User, UserChat } from '../../db/models';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatGateway } from './chats.gateway';

@Module({
  imports: [SequelizeModule.forFeature([User, Chat, UserChat, ChatMessage])],
  controllers: [ChatsController],
  providers: [ChatsService, ChatGateway],
})
export class ChatsModule {}
