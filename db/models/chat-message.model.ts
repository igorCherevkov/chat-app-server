import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Chat, User } from './';

@Table({ tableName: 'chats_messages', timestamps: true, underscored: true })
export default class ChatMessage extends Model<ChatMessage> {
  @ForeignKey(() => Chat)
  @Column
  chatId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  message: string;

  @Column
  imageUrl: string;

  @BelongsTo(() => User)
  user: User;
}
