import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Chat, ChatMessage, User, UserChat } from '../../db/models';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat) private chatModel: typeof Chat,
    @InjectModel(UserChat) private userChatModel: typeof UserChat,
    @InjectModel(ChatMessage) private chatMessageModel: typeof ChatMessage,
    @InjectModel(User) private userModel: typeof User,
  ) {}
}
