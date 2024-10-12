import {
  Table,
  Model,
  Column,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';

import { ChatMessage, UserChat } from './';

enum Roles {
  user = 'user',
  admin = 'admin',
}

@Table({ tableName: 'users', timestamps: true, underscored: true })
export default class User extends Model<User> {
  @Column({ unique: true, allowNull: false })
  login: string;

  @Column({ allowNull: false })
  password: string;

  @Column
  avatar: string;

  @Column
  role: Roles;

  @HasMany(() => UserChat)
  userChats: UserChat[];

  @HasMany(() => ChatMessage)
  chatMessages: ChatMessage[];
}
