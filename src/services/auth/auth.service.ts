import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../../models/user.model';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly userModel: Model<UserModel>,
    private jwtService: JwtService,
  ) {}

  async createUser(userForm: UserModel): Promise<{ token: string }> {
    console.log(userForm);
    const { username, password } = userForm;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      username,
      password: hashedPassword,
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
}
