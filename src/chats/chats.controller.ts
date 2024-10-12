import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../../src/users/auth/guards/jwt-auth.guard';
import { CreateChatDto, CreateGroupChatDto } from './dto/chats.dto';
import { Chat, ChatMessage } from '../../db/models';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserChats(@Param('id', ParseIntPipe) id: number): Promise<Chat[]> {
    return this.chatsService.getUserChats(id);
  }

  @Get('messages/:chatId')
  getChatMessages(
    @Param('chatId', ParseIntPipe) chatId: number,
  ): Promise<ChatMessage[]> {
    return this.chatsService.getChatMessages(chatId);
  }

  @Post(':id/create-chat')
  @UseGuards(JwtAuthGuard)
  createChat(
    @Param('id', ParseIntPipe) id: number,
    @Body() chat: CreateChatDto,
  ) {
    return this.chatsService.createChat(id, chat);
  }

  @Post(':id/create-group-chat')
  @UseGuards(JwtAuthGuard)
  createGroupChat(
    @Param('id', ParseIntPipe) id: number,
    @Body() groupChat: CreateGroupChatDto,
  ) {
    return this.chatsService.createGroupChat(id, groupChat);
  }
}
