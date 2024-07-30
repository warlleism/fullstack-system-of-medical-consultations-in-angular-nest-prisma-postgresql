import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { DbModule } from 'src/db/db.module';
import { UserRepository } from './user.repository';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { AuthController } from './auth.controller';

@Module({
  imports: [DbModule],
  controllers: [UserController, AuthController],
  providers: [UserRepository],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'user/getAll', method: RequestMethod.GET },
        { path: 'user/getOneById/:id', method: RequestMethod.GET },
        { path: 'user/delete/:id', method: RequestMethod.DELETE },
        { path: 'user/update', method: RequestMethod.PATCH },
      );
  }
}
