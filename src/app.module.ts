import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseModule } from './modules/base/base.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      'mongodb+srv://prj786:Azerbaijanistheking@remedium-cluster.wsmtpoh.mongodb.net/?retryWrites=true&w=majority',
      {
        autoCreate: true,
      },
    ),
    BaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
