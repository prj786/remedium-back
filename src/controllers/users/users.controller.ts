import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { ErrorService } from '../../services/error/error.service';
import { AuthGuard } from '@nestjs/passport';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'This user exists'],
    unique: [true, 'Username is not unique'],
  },
  password: { type: String, required: true, min: [6, 'Password is short'] },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  saleIncome: Number,
  registerDate: {
    type: [Date, 'Date type is wrong!'],
    required: [true, 'Register Date is required'],
  },
});

export class UserSearch {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  registerDateFrom?: Date;

  @IsOptional()
  @IsDateString()
  registerDateTo?: Date;

  @IsOptional()
  @IsNumber()
  totalSaleFrom?: number;

  @IsOptional()
  @IsNumber()
  totalSaleTo?: number;
}

@Controller('api/users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
  ) {}
  @Post('/create')
  createUser(@Body() user: UserModel) {
    try {
      return this.authService.createUser(user);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Post('/login')
  signIn(@Body() user: UserModel) {
    try {
      return this.authService.signIn(user);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Get('/list/:limit/:page')
  getData(@Param() param, @Query() search: UserSearch) {
    try {
      return this.authService.getList(param, search);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Put('/update')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Body() user: UserModel) {
    try {
      return await this.authService.updateUser(user);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Delete('/delete/:userId')
  @UseGuards(AuthGuard('jwt'))
  async deleteUSer(@Param() param) {
    try {
      await this.authService.deleteUser(param.userId);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }
}
