import { Module } from '@nestjs/common';
import {
  AuthController,
  AuthSchema,
} from '../../controllers/auth/auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ErrorService } from '../../services/error/error.service';
import * as process from 'process';
import { JwtStrategy } from '../../jwt.strategy';

console.log(process.env.JWT_SECRET_KEY);

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       secret: config.get('JWT_SECRET_KEY'),
    //       signOptions: {
    //         expiresIn: config.get('JWT_EXPIRES'),
    //       },
    //     };
    //   },
    // }),
    JwtModule.register({
      secret: 'someRandomPhraseWithSymbolsAndChars',
      signOptions: {
        expiresIn: '2d',
      },
    }),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, ErrorService, ConfigService, JwtStrategy],
  exports: [JwtModule, JwtStrategy, PassportModule],
})
export class AuthModule {}
