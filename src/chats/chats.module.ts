import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Chat, ChatMessage, User, UserChat } from '../../db/models';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [SequelizeModule.forFeature([Chat, UserChat, ChatMessage, User])],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
