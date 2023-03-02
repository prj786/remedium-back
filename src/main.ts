import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(process.env.PORT || 8080);
}
bootstrap().then(() => console.log('Server Started..' + process.env.PORT));
