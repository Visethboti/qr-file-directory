import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { CheckPasswordMiddleware } from './check-password-middleware';

@Module({
  imports: [EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckPasswordMiddleware)
      .forRoutes({ path: 'employee', method: RequestMethod.ALL });
  }
}
