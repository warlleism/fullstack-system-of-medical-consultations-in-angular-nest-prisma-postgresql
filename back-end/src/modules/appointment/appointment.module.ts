import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { DbModule } from 'src/db/db.module';
import { AppointmentRepository } from './appointment.repository';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [DbModule],
  controllers: [AppointmentController],
  providers: [AppointmentRepository, UserRepository],
})
export class AppointmentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'appointment/create', method: RequestMethod.POST },
        { path: 'appointment/getAll', method: RequestMethod.GET },
        { path: 'appointment/getOneById/:id', method: RequestMethod.GET },
        { path: 'appointment/delete/:id', method: RequestMethod.DELETE },
        { path: 'appointment/update', method: RequestMethod.PATCH },
      );
  }
}
