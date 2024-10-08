import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../../db/models';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findUser(login: string): Promise<User> {
    return await this.userModel.findOne({
      where: { login },
    });
  }
}
