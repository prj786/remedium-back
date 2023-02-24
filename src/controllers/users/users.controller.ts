import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { ErrorService } from '../../services/error/error.service';

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'This user exists'],
    unique: [true, 'Username is not unique'],
  },
  password: { type: String, required: true, min: [6, 'Password is short'] },
  firstName: {
    type: String,
    validate: (val) => /^[A-Za-z]/.test(val),
  },
  lastName: {
    type: String,
    validate: (val) => /^[A-Za-z]/.test(val),
  },
  saleDate: { type: [Date, 'Date type is wrong'] },
  saleIncome: Number,
  registerDate: {
    type: [Date, 'Date type is wrong!'],
    required: [true, 'Register Date is required'],
  },
});

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
      // this.errorService.returnResp(err);
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

  @Get('/list/:count')
  getData(@Param() param) {
    try {
      return this.authService.getList(param.count);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }
}
