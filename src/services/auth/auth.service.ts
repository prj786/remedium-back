import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserListModel, UserModel } from '../../models/user.model';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PayloadModel } from '../../models/payload.model';
import { UserSearch } from '../../controllers/users/users.controller';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<UserModel>,
    private jwtService: JwtService,
  ) {}

  async createUser(userDto: UserModel): Promise<UserModel> {
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

    const savedUser = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      registerDate: new Date(),
      saleIncome: 0,
    };

    this.jwtService.sign({ id: user._id });

    return savedUser;
  }

  async updateUser(userDto: UserModel): Promise<any> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    return this.userModel
      .findByIdAndUpdate(userDto._id, { ...userDto, password: hashedPassword })
      .setOptions({ overwrite: true });
  }

  async updateSaleIncome(userId: string, saleIncome: number): Promise<any> {
    return this.userModel
      .findByIdAndUpdate(userId, { ['saleIncome']: saleIncome }, { new: true })
      .setOptions({ overwrite: false });
  }

  async deleteUser(userId: string): Promise<any> {
    return this.userModel.findByIdAndDelete(userId);
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

    const savedUser = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      registerDate: new Date(),
      saleIncome: user.saleIncome,
    };

    return { token, user: savedUser };
  }

  async getList(
    pagination: { limit: number; page: number } = { limit: 10, page: 1 },
    searchDto: UserSearch,
  ): Promise<PayloadModel<UserListModel[]>> {
    let query = {};

    if (searchDto.search) {
      query = {
        $or: [
          { username: { $regex: searchDto.search, $options: 'i' } },
          { firstName: { $regex: searchDto.search, $options: 'i' } },
          { lastName: { $regex: searchDto.search, $options: 'i' } },
        ],
      };
    }
    if (searchDto.registerDateFrom && searchDto.registerDateFrom) {
      query['registerDate'] = {
        $gte: searchDto.registerDateFrom,
        $lte: searchDto.registerDateTo,
      };
    } else if (searchDto.registerDateFrom) {
      query['registerDate'] = {
        $gte: searchDto.registerDateFrom,
      };
    } else if (searchDto.registerDateTo) {
      query['registerDate'] = {
        $lte: searchDto.registerDateTo,
      };
    }

    if (searchDto.totalSaleFrom && searchDto.totalSaleTo) {
      query['saleIncome'] = {
        $gte: searchDto.totalSaleFrom,
        $lte: searchDto.totalSaleTo,
      };
    } else if (searchDto.totalSaleFrom) {
      query['saleIncome'] = { $gte: searchDto.totalSaleFrom };
    } else if (searchDto.totalSaleTo) {
      query['saleIncome'] = { $lte: searchDto.totalSaleTo };
    }

    const users = (await this.userModel
      .find(query)
      .skip((pagination.page - 1) * pagination.limit)
      .limit(pagination.limit)
      .exec()) as unknown as UserListModel[];

    const size = await this.userModel.countDocuments(query).exec();

    return {
      items: users.map((user) => {
        return {
          _id: user._id,
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
