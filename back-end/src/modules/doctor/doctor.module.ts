import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DbModule } from 'src/db/db.module';
import { DoctorRepository } from './doctor.repository';
import { AppointmentRepository } from '../appointment/appointment.repository';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [DbModule],
  controllers: [DoctorController],
  providers: [DoctorRepository, AppointmentRepository, UserRepository]
})
export class DoctorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'doctor/create', method: RequestMethod.POST },
        { path: 'doctor/getAll', method: RequestMethod.GET },
        { path: 'doctor/getOneById/:id', method: RequestMethod.GET },
        { path: 'doctor/delete/:id', method: RequestMethod.DELETE },
        { path: 'doctor/update', method: RequestMethod.PATCH },
      );
  }
}
