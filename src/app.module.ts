import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseModule } from './modules/base/base.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot(
      'mongodb+srv://prj786:Azerbaijanistheking@remedium-cluster.wsmtpoh.mongodb.net/?retryWrites=true&w=majority',
    ),
    BaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
