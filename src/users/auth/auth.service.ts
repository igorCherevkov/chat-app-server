import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users.service';
import { RequestingData, ReturningData, Roles } from '../types/types';
import { User } from '../../../db/models';
import { registrationDto } from '../dto/registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async registration(user: registrationDto): Promise<ReturningData> {
    const checkLogin = await this.userModel.findOne({
      where: { login: user.login },
    });

    if (checkLogin) throw new Error('login already exists');

    const hashPassword = await bcrypt.hash(user.password, 5);
    const newUser = await this.userModel.create({
      login: user.login,
      password: hashPassword,
      avatar: null,
      role: Roles.user,
    });

    const token = await this.generateToken({
      id: newUser.id,
      login: newUser.login,
      avatar: newUser.avatar,
      role: newUser.role,
    });

    return {
      ...token,
    };
  }

  async validateUser(login: string, password: string): Promise<User> {
    const checkUser = await this.usersService.findUser(login);

    const passwordsIsMatch = await bcrypt.compare(password, checkUser.password);

    if (checkUser && passwordsIsMatch) {
      return checkUser;
    }

    throw new BadRequestException('login or password are incorrect');
  }

  async generateToken(user: RequestingData): Promise<ReturningData> {
    const { id, avatar, login, role } = user;

    const token = this.jwtService.sign({
      id: user.id,
      login: user.login,
      avatar: user.avatar,
      role: user.role,
    });

    return {
      id,
      login,
      avatar,
      role,
      token,
    };
  }
}
