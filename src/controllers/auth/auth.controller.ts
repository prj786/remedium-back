import { Body, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { ErrorService } from '../../services/error/error.service';

export const AuthSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
});
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
  ) {}
  @Post('/sign-up')
  createUser(@Body() user: UserModel) {
    try {
      return this.authService.createUser(user);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }

  @Post('/sign-in')
  signIn(@Body() user: UserModel) {
    try {
      return this.authService.signIn(user);
    } catch (err) {
      this.errorService.returnResp(err);
    }
  }
}
