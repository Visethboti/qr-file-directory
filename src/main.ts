import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('/storage', (req, res, next) => {
    const password = process.env.PASSWORD;
    console.log(password);

    const isAuthenticated = req.headers['password'] === password;

    if (isAuthenticated) {
      next();
    } else {
      res.status(403).send('Access denied.');
    }
  });
  app.useStaticAssets(join(__dirname, '..', 'storage'), {
    prefix: '/storage/',
  });

  await app.listen(3000);
}
bootstrap();
