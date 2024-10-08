import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from '../../db/models';
import { ChangeProfileDto } from './dto/changeProfile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findUser(login: string): Promise<User> {
    return await this.userModel.findOne({
      where: { login },
    });
  }

  async changeProfile(
    changeProfile: ChangeProfileDto,
    userId: number,
    filename: string,
  ) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new BadRequestException('user not found');
    }

    if (changeProfile.oldPassword && changeProfile.newPassword) {
      const passwordsIsMatch = await bcrypt.compare(
        changeProfile.oldPassword,
        user.password,
      );

      if (!passwordsIsMatch) {
        throw new BadRequestException('old password is incorrect');
      }

      const newHashedPassword = await bcrypt.hash(changeProfile.newPassword, 5);
      user.password = newHashedPassword;
    }

    if (filename) {
      const filePath = `uploads/users-avatars/${filename}`;
      user.avatar = filePath;
    }

    user.save();

    return this.userModel.findOne({
      where: { id: user.id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    });
  }

  async getAllUsers() {
    return this.userModel.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    });
  }
}
