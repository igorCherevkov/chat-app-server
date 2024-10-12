import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { Chat, User } from './';

@Table({ tableName: 'users_chats', timestamps: true, underscored: true })
export default class UserChat extends Model<UserChat> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Chat)
  @Column
  chatId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Chat)
  chat: Chat;
}
