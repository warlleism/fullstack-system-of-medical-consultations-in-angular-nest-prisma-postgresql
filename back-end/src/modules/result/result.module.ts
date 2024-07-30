import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ResultController } from './result.controller';
import { ResultRepository } from './result.repository';
import { DbModule } from 'src/db/db.module';
import { UserRepository } from '../user/user.repository';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';

@Module({
  imports: [DbModule],
  controllers: [ResultController],
  providers: [ResultRepository, UserRepository],
})
export class ResultModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'result/create', method: RequestMethod.POST },
        { path: 'result/delete/:id', method: RequestMethod.DELETE },
        { path: 'result/update', method: RequestMethod.PATCH },
      );
  }
}
