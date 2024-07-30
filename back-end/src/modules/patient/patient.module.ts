import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { DbModule } from 'src/db/db.module';
import { PatientRepository } from './patient.repository';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [DbModule],
  controllers: [PatientController],
  providers: [PatientRepository, UserRepository],
})
export class PatientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'patient/create', method: RequestMethod.POST },
        { path: 'patient/getAll', method: RequestMethod.GET },
        { path: 'patient/getOneById/:id', method: RequestMethod.GET },
        { path: 'patient/delete/:id', method: RequestMethod.DELETE },
        { path: 'patient/update', method: RequestMethod.PATCH },
      );
  }
}
