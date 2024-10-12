import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Chat, ChatMessage, User, UserChat } from '../../db/models';
import { CreateChatDto, CreateGroupChatDto } from './dto/chats.dto';
import { CreateMessageDto } from './dto/createMessage.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Chat) private chatModel: typeof Chat,
    @InjectModel(UserChat) private userChatModel: typeof UserChat,
    @InjectModel(ChatMessage) private chatMessageModel: typeof ChatMessage,
  ) {}

  async getUserChats(userId: number): Promise<Chat[]> {
    const chats = await this.chatModel.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: UserChat,
          where: { userId },
          attributes: {
            exclude: ['chatId', 'userId', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: ChatMessage,
          attributes: ['message', 'createdAt'],
          where: { message: { [Op.ne]: null } },
          limit: 1,
          order: [['createdAt', 'DESC']],
          required: true,
        },
      ],
    });

    const chatsIds = chats.map((chat) => chat.id);

    const users = await UserChat.findAll({
      where: {
        chatId: chatsIds,
        userId: { [Op.ne]: userId },
      },
      include: [
        {
          model: User,
          attributes: ['id', 'login', 'avatar'],
        },
      ],
    });

    const chatUsersMap = users.reduce((acc, userChat) => {
      const chatId = userChat.chatId;
      if (!acc[chatId]) {
        acc[chatId] = [];
      }
      acc[chatId].push(userChat.user);
      return acc;
    }, {});

    const chatsWithUsers = chats.map((chat) => ({
      ...chat.toJSON(),
      users: chatUsersMap[chat.id] || [],
    }));

    return chatsWithUsers as Chat[];
  }

  async getChatMessages(chatId: number): Promise<ChatMessage[]> {
    return this.chatMessageModel.findAll({
      where: { chatId },
      include: [
        {
          model: User,
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        },
      ],
    });
  }

  async createChat(userId: number, chat: CreateChatDto) {
    const otherUser = await this.userModel.findOne({
      where: { login: chat.otherUserLogin },
    });

    if (!otherUser) {
      throw new NotFoundException('user not found');
    }

    const existingChat = await this.chatModel.findAll({
      where: { isGroup: false },
      include: [
        {
          model: UserChat,
          where: {
            userId: {
              [Op.in]: [userId, otherUser.id],
            },
          },
        },
      ],
    });

    const checkChat = existingChat.map((chat) => chat.users.length === 2);

    if (checkChat.includes(true)) {
      return 'chat already exists';
    }

    const newChat = await this.chatModel.create({
      isGroup: false,
    });

    await Promise.all(
      [userId, otherUser.id].map((id) =>
        this.userChatModel.create({ chatId: newChat.id, userId: id }),
      ),
    );

    const usersInChat = await UserChat.findAll({
      where: {
        chatId: newChat.id,
        userId: { [Op.ne]: userId },
      },
      include: [
        {
          model: User,
          attributes: ['id', 'login', 'avatar'],
        },
      ],
    });

    const usersForReturn = usersInChat.map((userChat) => ({
      id: userChat.user.id,
      login: userChat.user.login,
      avatar: userChat.user.avatar,
    }));

    return { ...newChat.get(), users: usersForReturn };
  }

  async createGroupChat(userId: number, groupChat: CreateGroupChatDto) {
    const users = await this.userModel.findAll({
      where: { login: groupChat.otherUsersLogins },
    });

    if (users.length !== groupChat.otherUsersLogins.length) {
      throw new NotFoundException('users not found');
    }

    const userIds = users.map((user) => user.id);

    const newChat = await this.chatModel.create({
      isGroup: true,
    });

    await Promise.all(
      [userId, ...userIds].map((userId) =>
        this.userChatModel.create({ chatId: newChat.id, userId }),
      ),
    );

    const usersInChat = await UserChat.findAll({
      where: {
        chatId: newChat.id,
        userId: { [Op.ne]: userId },
      },
      include: [
        {
          model: User,
          attributes: ['id', 'login', 'avatar'],
        },
      ],
    });

    const usersForReturn = usersInChat.map((userChat) => ({
      id: userChat.user.id,
      login: userChat.user.login,
      avatar: userChat.user.avatar,
    }));

    return { ...newChat.get(), users: usersForReturn };
  }

  async saveMessage(messageDto: CreateMessageDto): Promise<ChatMessage> {
    const { chatId, userId, message } = messageDto;

    const chatUser = await this.userChatModel.findOne({
      where: { chatId, userId },
    });

    if (!chatUser) {
      throw new Error('user is not part of this chat');
    }

    const newMessage = await this.chatMessageModel.create({
      chatId,
      userId: chatUser.userId,
      message: message,
    });

    const messageToReturn = await this.chatMessageModel.findOne({
      where: { id: newMessage.id },
      include: [
        {
          model: User,
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    return messageToReturn;
  }

  async createImageMessage(
    chatId: number,
    userId: number,
    imageUrl: string,
  ): Promise<ChatMessage> {
    const messageText = 'image uploaded';

    const newMessage = await this.chatMessageModel.create({
      chatId,
      userId,
      message: messageText,
      imageUrl,
    });

    const messageToReturn = await this.chatMessageModel.findOne({
      where: { id: newMessage.id },
      include: [
        {
          model: User,
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    return messageToReturn;
  }
}
