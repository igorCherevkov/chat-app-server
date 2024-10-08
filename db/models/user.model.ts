import { Table, Model, Column, HasMany } from 'sequelize-typescript';

import { ChatMessage, UserChat } from './';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export default class User extends Model<User> {
  @Column({ unique: true, allowNull: false })
  login: string;

  @Column({ allowNull: false })
  password: string;

  @Column
  avatar: string;

  @Column
  role: string;

  @HasMany(() => UserChat)
  userChats: UserChat[];

  @HasMany(() => ChatMessage)
  chatMessages: ChatMessage[];
}
