import {
  Table,
  Column,
  Model,
  HasMany,
} from 'sequelize-typescript';

import { ChatMessage, UserChat } from './';

@Table({ tableName: 'chats', timestamps: true, underscored: true })
export default class Chat extends Model<Chat> {
  @Column
  isGroup: boolean;

  @HasMany(() => UserChat)
  users: UserChat[];

  @HasMany(() => ChatMessage)
  messages: ChatMessage[];
}
