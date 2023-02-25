import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserListModel, UserModel } from '../../models/user.model';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PayloadModel } from '../../models/payload.model';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<UserModel>,
    private jwtService: JwtService,
  ) {}

  async createUser(userDto: UserModel): Promise<{ token: string }> {
    const { username, password } = userDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      throw new UnauthorizedException('Password did not hashed');
    }

    const user = await this.userModel.create({
      username,
      password: hashedPassword,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      registerDate: new Date(),
      saleIncome: 0,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async signIn(
    userForm: UserModel,
  ): Promise<{ token: string; user: UserModel }> {
    const { username, password } = userForm;

    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid UserName');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid Password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token, user };
  }

  async getList(count: string): Promise<PayloadModel<UserListModel[]>> {
    const users = (await this.userModel
      .find()
      .limit(parseInt(count, 10))
      .exec()) as UserListModel[];
    const size = await this.userModel.countDocuments({});

    return {
      items: users.map((user) => {
        return {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          registerDate: user.registerDate[0],
          saleIncome: user.saleIncome,
        };
      }),
      size: size,
    } as PayloadModel<UserListModel[]>;
  }
}
