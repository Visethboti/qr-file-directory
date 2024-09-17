import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // limit user request for access static files in the project
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 3,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  });
  app.use('/storage/', limiter);

  app.useStaticAssets(join(__dirname, '..', 'storage'), {
    prefix: '/storage/',
  });

  await app.listen(3000);
}
bootstrap();
