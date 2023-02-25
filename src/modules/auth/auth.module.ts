import { Module } from '@nestjs/common';
import {
  UsersController,
  UserSchema,
} from '../../controllers/users/users.controller';
import { AuthService } from '../../services/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ErrorService } from '../../services/error/error.service';
import { JwtStrategy } from '../../jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
      ],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: config.get('JWT_EXPIRES'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [AuthService, ErrorService, JwtStrategy],
  exports: [JwtModule, JwtStrategy, PassportModule],
})
export class AuthModule {}
