import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../../models/user.model';

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

    const user = await this.userModel.create({
      username,
      password: hashedPassword,
      ...userDto,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async signIn(userForm: UserModel): Promise<{ token: string }> {
    console.log(userForm);
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

    return { token };
  }

  async getList(count: string): Promise<PayloadModel<UserModel[]>> {
    const users = (await this.userModel
      .find()
      .limit(parseInt(count, 10))
      .exec()) as UserModel[];
    const size = await this.userModel.countDocuments({});

    return { items: users, size: size } as PayloadModel<UserModel[]>;
  }
}
