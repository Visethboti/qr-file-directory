import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './document/document.module';
import { CheckPasswordMiddleware } from './check-password-middleware';

@Module({
  imports: [DocumentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckPasswordMiddleware)
      .forRoutes({ path: 'document', method: RequestMethod.ALL });
  }
}
